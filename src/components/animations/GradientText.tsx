'use client';

interface GradientTextProps {
    text: string;
    className?: string;
}

export default function GradientText({ text, className = '' }: GradientTextProps) {
    return (
        <span className={`animate-gradient-text font-bold ${className}`}>
            {text}
        </span>
    );
}
