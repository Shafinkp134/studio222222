import Image from 'next/image';
import type { HTMLAttributes } from 'react';

export function Logo(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <Image
        src="https://res.cloudinary.com/ddqzzqnjh/image/upload/v1767286657/hbn0rm8hof8mre3zu0dk.png"
        alt="MRSHOPY Logo"
        width={24}
        height={24}
        className="h-full w-full"
      />
    </div>
  );
}
