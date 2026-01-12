'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
}

export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={cardRef} className={`spotlight-card ${className}`}>
            {children}
        </div>
    );
}
