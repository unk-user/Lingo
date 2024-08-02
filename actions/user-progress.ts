'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { getCourseById, getUserProgress } from '@/db/queries';

import db from '@/db/drizzle';
import { challengeProgress, challenges, userProgress } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!user || !userId) {
    throw new Error('Unauthorized');
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error('Course not found');
  }

  //TODO: Enable once units and lessons are added
  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error('Course is emptyd');
  // }

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: course.id,
      userName: user.firstName || 'User',
      userImageSrc: user.imageUrl || '/mascot.svg',
    });

    revalidatePath('/courses');
    revalidatePath('/learn');
    redirect('/learn');
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || 'User',
    userImageSrc: user.imageUrl || '/mascot.svg',
  });

  revalidatePath('/courses');
  revalidatePath('/learn');
  redirect('/learn');
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const currentUserProgress = await getUserProgress();

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  const isPractice = !!existingChallengeProgress;

  if (isPractice) {
    return { error: 'practice' };
  }

  if (!currentUserProgress) {
    throw new Error('User progress not found');
  }

  if (currentUserProgress.hearts === 0) {
    return { error: 'hearts' };
  }

  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath('/learn');
  revalidatePath('/shop');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
  revalidatePath(`/lessons/${lessonId}`);
};

export const refillHearts = async (pointsToRefill: number) => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error('User progress not found');
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error('User already has 5 hearts');
  }

  if (currentUserProgress.points < pointsToRefill) {
    throw new Error('Not enough points');
  }

  await db
    .update(userProgress)
    .set({ hearts: 5, points: currentUserProgress.points - pointsToRefill })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath('/shop');
  revalidatePath('/learn');
  revalidatePath('/quests');
  revalidatePath('/leaderboard');
};
