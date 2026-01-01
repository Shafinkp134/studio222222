'use client';

import Image from 'next/image';
import type { HTMLAttributes } from 'react';

type LogoProps = {
  logoUrl?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Logo({ logoUrl, ...props }: LogoProps) {
  const finalLogoUrl = logoUrl || 'https://res.cloudinary.com/ddqzzqnjh/image/upload/v1767286657/hbn0rm8hof8mre3zu0dk.png';
  return (
    <div {...props}>
      <Image
        src={finalLogoUrl}
        alt="MRSHOPY Logo"
        width={24}
        height={24}
        className="h-full w-full"
      />
    </div>
  );
}
