'use client'  

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                router.back();
            }}
            className={"absolute top-4 left-4 text-white"}
        >
            <ChevronLeftIcon className="h-6 w-6 hover:cursor-pointer"/> 
        </button>
    );
}
