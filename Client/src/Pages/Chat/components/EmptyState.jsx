import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const EmptyState = ({ title, description, friendName }) => {
    return (
        <motion.div
            className="flex items-center justify-center h-full w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-center p-8 backdrop-blur-sm bg-white/60 rounded-2xl border border-gray-100 shadow-sm max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <h3 className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {title}
                </h3>

                {description && (
                    <p className="text-gray-600">
                        {description} {friendName && <span className="font-medium">{friendName}</span>}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default EmptyState;
