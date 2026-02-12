
import React from 'react';
import { Tag, CheckCircle } from 'lucide-react';
import type { ApiServicio } from '../types';
import { getEntityImage } from '../services/api';

interface ServiceCardProps {
    service: ApiServicio;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const image = getEntityImage(service.imagenes, 'SERVICIO');

    return (
        <div className="bg-deep-teal-900/40 border border-deep-teal-800 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-celadon-500/10 transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={service.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Type badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-celadon-500/90 text-deep-teal-950 px-3 py-1 text-xs font-bold rounded-full uppercase backdrop-blur-sm flex items-center gap-1">
                        <Tag size={12} />
                        {service.tipo}
                    </span>
                </div>
                {service.disponible_independiente === '1' && (
                    <div className="absolute top-4 right-4">
                        <span className="bg-mint-leaf-400/90 text-deep-teal-950 px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm flex items-center gap-1">
                            <CheckCircle size={12} />
                            Individual
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-lg font-serif font-bold mb-2 group-hover:text-celadon-500 transition-colors">
                    {service.nombre}
                </h3>
                {service.descripcion && (
                    <p className="text-sm text-deep-teal-50/60 leading-relaxed line-clamp-3">
                        {service.descripcion}
                    </p>
                )}
                {service.subdestino_nombre && (
                    <div className="mt-4 pt-4 border-t border-deep-teal-800">
                        <span className="text-xs text-celadon-500/70 uppercase tracking-wider">
                            📍 {service.subdestino_nombre}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;
