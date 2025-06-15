import React from 'react';
import { motion } from 'framer-motion';

export const GradientBackground = ({ children }) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {children}
        </div>
    );
};

export const BlurredShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating circles with blur effect */}
            <motion.div
                className="absolute w-64 h-64 rounded-full bg-blue-200/30 blur-2xl"
                initial={{ x: -100, y: -100 }}
                animate={{
                    x: [-100, 50, -50],
                    y: [-100, 50, -50],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            <motion.div
                className="absolute w-72 h-72 rounded-full bg-purple-200/30 blur-2xl"
                initial={{ x: "80vw", y: "60vh" }}
                animate={{
                    x: ["80vw", "70vw", "75vw"],
                    y: ["60vh", "50vh", "55vh"],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            <motion.div
                className="absolute w-56 h-56 rounded-full bg-pink-200/20 blur-2xl"
                initial={{ x: "40vw", y: "20vh" }}
                animate={{
                    x: ["40vw", "45vw", "35vw"],
                    y: ["20vh", "25vh", "15vh"],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>
    );
};

export const BackgroundEffects = ({ children }) => {
    return (
        <GradientBackground>
            <BlurredShapes />
            {children}
        </GradientBackground>
    );
};

export default BackgroundEffects;
