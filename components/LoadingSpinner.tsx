
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    count?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Cargando...', count = 3 }) => {
    return (
        <div className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 text-celadon-500">
                        <div className="w-5 h-5 border-2 border-celadon-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-medium">{message}</span>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="bg-deep-teal-900/40 border border-deep-teal-800 rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-52 bg-deep-teal-800/50"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-deep-teal-800/50 rounded w-1/3"></div>
                                <div className="h-6 bg-deep-teal-800/50 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-deep-teal-800/30 rounded w-full"></div>
                                    <div className="h-3 bg-deep-teal-800/30 rounded w-5/6"></div>
                                </div>
                                <div className="h-10 bg-deep-teal-800/40 rounded-lg w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
