'use client';

import { useEffect, useRef } from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function SplitText({ text, className = '', delay = 0 }: SplitTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const chars = containerRef.current?.querySelectorAll('.split-char');
        chars?.forEach((char, index) => {
            (char as HTMLSpanElement).style.animationDelay = `${delay + index * 50}ms`;
        });
    }, [delay]);

    return (
        <span ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className="split-char animate-split-reveal inline-block"
                    style={{
                        animationDelay: `${delay + index * 50}ms`,
                        display: char === ' ' ? 'inline' : 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
}
