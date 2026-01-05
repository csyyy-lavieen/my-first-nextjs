'use client';

interface BlurTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function BlurText({ text, className = '', delay = 0 }: BlurTextProps) {
    return (
        <span
            className={`animate-blur-reveal inline-block ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {text}
        </span>
    );
}
