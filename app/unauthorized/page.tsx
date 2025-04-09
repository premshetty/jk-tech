'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "Access Denied";

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push('/');
        }, 1500); 

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold text-red-500">{message}</h1>
            <p className="text-sm mt-2">Redirecting to home...</p>
        </div>
    );
}
