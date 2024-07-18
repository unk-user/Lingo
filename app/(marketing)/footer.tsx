import { Button } from '@/components/ui/button';
import Image from 'next/image';

const flags = [
  {
    name: 'Croatian',
    src: '/hr.svg',
  },
  {
    name: 'Spanish',
    src: '/es.svg',
  },
  {
    name: 'French',
    src: '/fr.svg',
  },
  {
    name: 'Italian',
    src: '/it.svg',
  },
  {
    name: 'Japanese',
    src: '/jp.svg',
  },
];

export function Footer() {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        {flags.map((flag) => (
          <Button key={flag.name}>
            <Image
              src={flag.src}
              alt={flag.name}
              height={32}
              width={32}
              className="mr-4 rounded-md"
            />
            {flag.name}
          </Button>
        ))}
      </div>
    </footer>
  );
}
