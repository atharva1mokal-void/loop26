'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export function HolographicField() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Mouse variants for satisfying spring physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    // Generate a grid of interactive points
    const points = Array.from({ length: 64 }).map((_, i) => ({
        id: i,
        x: (i % 8) * 12 - 42, // Spread 8x8 grid
        y: Math.floor(i / 8) * 12 - 42,
    }));

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden glass-panel border border-[var(--glass-border)] mb-12 group perspective-1000 bg-[#020202]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--neon-purple)_0%,_transparent_70%)] opacity-10 blur-3xl" />

            {/* Interactive 3D Plane */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center preserve-3d"
                style={{
                    rotateX: useTransform(springY, [-300, 300], [15, -15]),
                    rotateY: useTransform(springX, [-300, 300], [-15, 15]),
                }}
            >
                <div className="relative w-[600px] h-[600px] grid grid-cols-8 gap-8 p-12 transform-style-3d">
                    {points.map((point) => (
                        <InteractiveNode
                            key={point.id}
                            mouseX={springX}
                            mouseY={springY}
                            baseX={point.x}
                            baseY={point.y}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Overlay UI */}
            <div className="absolute bottom-0 left-0 p-8 z-20 max-w-xl pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        Hyper-Field Matrix
                    </h2>
                    <p className="text-[var(--text-secondary)] backdrop-blur-sm bg-black/30 p-2 rounded-lg inline-block">
                        Interactive neural interface. Manipulate the grid to initiate system protocols.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function InteractiveNode({ mouseX, mouseY, baseX, baseY }: { mouseX: any, mouseY: any, baseX: number, baseY: number }) {
    // Each node reacts to the mouse proximity individually using transforms
    const x = useTransform(mouseX, (val: number) => {
        const distance = Math.abs(val - baseX * 5); // simplified distance approx
        return (val - baseX * 5) * (150 / (distance + 50)); // Repulsion/Attraction
    });

    const y = useTransform(mouseY, (val: number) => {
        const distance = Math.abs(val - baseY * 5);
        return (val - baseY * 5) * (150 / (distance + 50));
    });

    const scale = useTransform(mouseX, (val: number) => {
        const distance = Math.abs(val - baseX * 5);
        return Math.max(1, 1.5 - distance / 500);
    });

    return (
        <motion.div
            className="relative flex items-center justify-center"
            style={{ x, y, scale }}
        >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/30 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.1)] hover:bg-[var(--neon-cyan)] hover:shadow-[0_0_30px_var(--neon-cyan)] transition-colors duration-300 cursor-crosshair group">
                <div className="absolute inset-0 bg-[var(--neon-cyan)]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
        </motion.div>
    );
}
