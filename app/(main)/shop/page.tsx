import { FeedWrapper } from '@/components/FeedWrapper';
import { StickyWrapper } from '@/components/StickyWrapper';
import { UserProgress } from '@/components/UserProgress';
import { getUserProgress, getUserSubscription } from '@/db/queries';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Items } from './Items';

export default async function ShopPage() {
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressPromise,
    userSubscriptionPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses');
  }

  const hasActiveSubcription = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={hasActiveSubcription}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/shop.svg" alt="shop" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Shop
          </h1>
          <p className="text-muted text-center text-lg mb-6">
            Spend you points on cool stuff
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={hasActiveSubcription}
          />
        </div>
      </FeedWrapper>
    </div>
  );
}
