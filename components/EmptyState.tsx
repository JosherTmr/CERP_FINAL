
import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'Sin resultados',
    message = 'No hay elementos disponibles en este momento.',
    icon
}) => {
    return (
        <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-deep-teal-900/60 border border-deep-teal-800 rounded-full flex items-center justify-center mb-8">
                {icon || <SearchX className="w-9 h-9 text-celadon-500/60" />}
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-deep-teal-50/80">{title}</h3>
            <p className="text-deep-teal-50/50 leading-relaxed">{message}</p>
        </div>
    );
};

export default EmptyState;
