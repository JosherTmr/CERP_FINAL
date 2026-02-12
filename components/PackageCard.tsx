
import React from 'react';
import { Clock, CheckCircle, PlusCircle, ChevronRight } from 'lucide-react';
import type { ApiPaquete } from '../types';
import { getEntityImage } from '../services/api';

interface PackageCardProps {
  paquete: ApiPaquete;
  onViewDetail?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ paquete, onViewDetail }) => {
  const image = getEntityImage(paquete.imagenes, 'PAQUETE');
  const servicios = paquete.servicios || [];
  const includedServices = servicios.filter(s => s.es_opcional !== '1');

  return (
    <div className="bg-deep-teal-900/40 border border-deep-teal-800 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-celadon-500/10 transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={paquete.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {paquete.destino_nombre && (
          <div className="absolute top-4 left-4 bg-deep-teal-950/80 backdrop-blur-md text-celadon-500 px-3 py-1 text-xs font-bold rounded-full uppercase">
            {paquete.destino_nombre}
          </div>
        )}
        {paquete.duracion_horas && (
          <div className="absolute bottom-4 right-4 bg-deep-teal-950/80 backdrop-blur-md px-3 py-1 rounded-lg">
            <span className="text-celadon-500 font-bold flex items-center gap-1">
              <Clock size={14} />
              {paquete.duracion_horas}h
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-ocean-mist-400 text-xs uppercase tracking-wider mb-2">
          {paquete.subdestino_nombre && (
            <span>📍 {paquete.subdestino_nombre}</span>
          )}
        </div>
        <h3 className="text-xl font-serif font-bold mb-3">{paquete.nombre}</h3>

        {paquete.descripcion && (
          <p className="text-sm text-deep-teal-50/60 line-clamp-2 mb-4">{paquete.descripcion}</p>
        )}

        {includedServices.length > 0 && (
          <div className="space-y-2 mb-6">
            {includedServices.slice(0, 3).map(svc => (
              <div key={svc.id_servicio} className="flex items-center gap-2 text-sm text-deep-teal-50/70">
                <CheckCircle size={14} className="text-mint-leaf-400 shrink-0" />
                {svc.nombre}
              </div>
            ))}
            {includedServices.length > 3 && (
              <div className="text-xs text-celadon-500 italic">+ {includedServices.length - 3} servicios más</div>
            )}
          </div>
        )}

        {paquete.capacidad_maxima && (
          <div className="text-xs text-deep-teal-50/40 mb-4">
            Hasta {paquete.capacidad_maxima} personas
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onViewDetail}
            className="bg-celadon-500 hover:bg-celadon-600 text-deep-teal-950 py-2 rounded-lg font-bold transition-colors text-sm flex items-center justify-center gap-1"
          >
            Ver Detalles
            <ChevronRight size={14} />
          </button>
          <button className="border border-celadon-500 text-celadon-500 hover:bg-celadon-500/10 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2">
            <PlusCircle size={16} />
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
