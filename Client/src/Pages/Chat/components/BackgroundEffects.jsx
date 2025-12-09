import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects = ({ children }) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-white">
            {children}
        </div>
    );
};

export default BackgroundEffects;
