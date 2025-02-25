'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#08090a] py-5">
      <div className="container mx-auto flex justify-center">
        <Link href="/">
          <Image 
            src="https://storage.googleapis.com/firmos-pics/FirmOS%20Logo%20-%20White.png" 
            alt="FirmOS Logo" 
            width={150} 
            height={150} 
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
}