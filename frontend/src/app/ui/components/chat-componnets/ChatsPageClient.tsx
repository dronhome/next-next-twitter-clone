'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatsPageClient() {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    return null;
}
