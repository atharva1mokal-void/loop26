'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface ActionButtonProps {
    label: string;
    icon: ReactNode;
    color: 'purple' | 'blue' | 'cyan';
    onClick?: () => void;
}

export function ActionButton({ label, icon, color, onClick }: ActionButtonProps) {
    const [clicked, setClicked] = useState(false);

    const colors = {
        purple: 'text-[var(--neon-purple)] border-[var(--neon-purple)] hover:bg-[var(--neon-purple)]',
        blue: 'text-[var(--neon-blue)] border-[var(--neon-blue)] hover:bg-[var(--neon-blue)]',
        cyan: 'text-[var(--neon-cyan)] border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]',
    };

    const handleClick = () => {
        setClicked(true);
        onClick?.();
        setTimeout(() => setClicked(false), 2000);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`
                relative px-6 py-3 rounded-lg border border-opacity-30 
                font-bold uppercase tracking-wider text-sm flex items-center gap-2
                transition-all duration-300 bg-opacity-5 overflow-hidden group
                ${colors[color]}
                ${clicked ? 'bg-opacity-20 border-opacity-100' : 'bg-transparent'}
            `}
        >
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {clicked ? 'EXECUTING...' : label}
            </span>

            {/* Background Fill Animation */}
            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${colors[color].split(' ').pop()?.replace('hover:', '')}`} />
        </motion.button>
    );
}
