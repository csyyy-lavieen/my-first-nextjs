'use client';

import { useEffect, useRef } from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function SplitText({ text, className = '', delay = 0 }: SplitTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    // Optimized: Removed redundant useEffect that was duplicating style setting
    // The style is already set directly in the render method below


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
