'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "Access Denied";
    const [countdown, setCountdown] = useState(3);
    const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number; opacity: number; }>>([]);

    // Generate random particles
    useEffect(() => {
        const newParticles = Array.from({ length: 50 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
        }));
        setParticles(newParticles);

        const interval = setInterval(() => {
            setParticles(prev =>
                prev.map(p => ({
                    ...p,
                    y: (p.y + p.speed) % 100,
                    x: p.x + (Math.random() - 0.5) * 0.5,
                }))
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Countdown and redirect
    useEffect(() => {
        if (countdown <= 0) {
            router.push('/');
            return;
        }

        const timeout = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [countdown, router]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-red-500"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            opacity: particle.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Security breach animation */}
            <div className="absolute inset-0 border-8 border-red-500 opacity-20 animate-pulse pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full mx-auto p-8">
                <div className="flex flex-col items-center">
                    {/* Animated lock icon */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-5 rounded-full shadow-lg animate-bounce">
                            <Lock className="h-12 w-12" />
                        </div>
                    </div>

                    {/* Alert message with typing effect */}
                    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-red-500/30 w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
                            <h1 className="text-2xl font-bold text-red-500 typewriter overflow-hidden whitespace-nowrap">
                                {message}
                            </h1>
                        </div>

                        <div className="h-2 w-full bg-gray-700 rounded-full mt-6 overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(countdown / 3) * 100}%` }}
                            />
                        </div>

                        <p className="text-center mt-4 text-gray-300">
                            Redirecting in <span className="text-red-400 font-mono">{countdown}</span> seconds
                        </p>

                        <div className="mt-6 flex justify-center">
                            <Button
                                variant="outline"
                                className="group border-red-500/50 hover:bg-red-500/20 text-red-400"
                                onClick={() => router.push('/')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Return to safety
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent mix-blend-overlay pointer-events-none" />

            {/* Scanlines effect */}
            <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />
        </div>
    );
}
