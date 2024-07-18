import { FeedWrapper } from '@/components/FeedWrapper';
import { StickyWrapper } from '@/components/StickyWrapper';
import { Header } from './Header';
import { UserProgress } from '@/components/UserProgress';
import { getUnits, getUserProgress } from '@/db/queries';
import { redirect } from 'next/navigation';
import { Unit } from './Unit';

export default async function Learn() {
  const userProgressPromise = getUserProgress();
  const unitsPromise = getUnits();

  const [userProgress, units] = await Promise.all([
    userProgressPromise,
    unitsPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses');
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              title={unit.title}
              order={unit.order}
              description={unit.description}
              lessons={unit.lessons}
              activeLesson={undefined}
              activeLessonPercentage={0}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
}
