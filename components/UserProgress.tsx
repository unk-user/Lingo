import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { InfinityIcon } from 'lucide-react';
import { courses } from '@/db/schema';

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export function UserProgress({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: Props) {
  return (
    <div className="flex item-center justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            height={32}
            width={32}
            className="rounded-md border"
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            src="/points.svg"
            alt="points"
            height={28}
            width={28}
            className="mr-2"
          />
          {points}
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-rose-500">
          <Image
            src="/heart.svg"
            alt="Hearts"
            height={22}
            width={22}
            className="mr-2"
          />
          {hasActiveSubscription ? <InfinityIcon /> : hearts}
        </Button>
      </Link>
    </div>
  );
}
