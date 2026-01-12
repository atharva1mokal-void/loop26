'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LiveBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate random floating cubes
    const cubes = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 40 + 20,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020202]">
            {/* Ambient Gradient Mesh */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--neon-purple)] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--neon-blue)] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[var(--neon-cyan)] rounded-full blur-[100px] opacity-50 animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Floating Cubes */}
            {cubes.map((cube) => (
                <motion.div
                    key={cube.id}
                    className="absolute border border-[var(--neon-purple)]/20 bg-[var(--neon-purple)]/5 backdrop-blur-sm"
                    style={{
                        width: cube.size,
                        height: cube.size,
                        left: `${cube.initialX}%`,
                        top: `${cube.initialY}%`,
                        borderRadius: 8,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: cube.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: cube.delay,
                    }}
                />
            ))}

            {/* Interactive Blobs (Slime effect) */}
            <motion.div
                className="absolute w-64 h-64 bg-[var(--neon-blue)] rounded-full blur-[80px] opacity-20"
                animate={{
                    x: mousePosition.x - 128,
                    y: mousePosition.y - 128,
                }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5
                }}
            />
            <motion.div
                className="absolute w-48 h-48 bg-[var(--neon-cyan)] rounded-full blur-[60px] opacity-20"
                animate={{
                    x: mousePosition.x - 96,
                    y: mousePosition.y - 96,
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                }}
            />
        </div>
    );
}
