
import React from 'react';
import { ArrowLeft, MapPin, ChevronRight, Globe } from 'lucide-react';
import type { ApiDestino, NavigationState } from '../types';
import { fetchDestinoById } from '../services/api';
import { getEntityImage } from '../services/api';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface DestinationDetailProps {
    destinoId: string;
    onNavigate: (nav: NavigationState) => void;
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destinoId, onNavigate }) => {
    const { data: destino, loading, error } = useApi<ApiDestino>(
        () => fetchDestinoById(destinoId),
        [destinoId]
    );

    if (loading) return <LoadingSpinner message="Cargando destino..." count={3} />;

    if (error || !destino) {
        return (
            <div className="pt-24">
                <EmptyState
                    title="Error al cargar"
                    message={error || 'No se pudo cargar el destino.'}
                />
            </div>
        );
    }

    const heroImage = getEntityImage(destino.imagenes, 'DESTINO');

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt={destino.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950 via-deep-teal-950/60 to-transparent"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 pb-16 pt-32">
                    {/* Back button */}
                    <button
                        onClick={() => onNavigate({ view: 'home' })}
                        className="flex items-center gap-2 text-celadon-500 hover:text-celadon-400 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Volver a Destinos</span>
                    </button>
                    <div className="flex items-center gap-2 text-celadon-500/70 text-sm mb-4">
                        <Globe size={14} />
                        <span>{destino.pais}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                        {destino.nombre}
                    </h1>
                    <p className="text-lg text-deep-teal-50/70 max-w-3xl leading-relaxed">
                        {destino.descripcion}
                    </p>
                </div>
            </section>

            {/* Subdestinos Grid */}
            <section className="py-24 bg-deep-teal-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
                            Explora
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">
                            Zonas de {destino.nombre}
                        </h2>
                    </div>

                    {destino.subdestinos && destino.subdestinos.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destino.subdestinos.map(sub => {
                                const subImage = getEntityImage(sub.imagenes, 'SUBDESTINO');
                                return (
                                    <div
                                        key={sub.id_subdestino}
                                        onClick={() => onNavigate({ view: 'subdestino', destinoId, subdestinoId: sub.id_subdestino })}
                                        className="group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer border border-deep-teal-800 hover:border-celadon-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-celadon-500/10"
                                    >
                                        <img
                                            src={subImage}
                                            alt={sub.nombre}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950 via-deep-teal-950/30 to-transparent opacity-90"></div>
                                        <div className="absolute bottom-0 left-0 p-6 w-full">
                                            <div className="flex items-center gap-2 text-celadon-500/70 text-xs uppercase tracking-wider mb-2">
                                                <MapPin size={12} />
                                                {sub.latitud && sub.longitud ? `${parseFloat(sub.latitud).toFixed(2)}°, ${parseFloat(sub.longitud).toFixed(2)}°` : destino.pais}
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold mb-2">{sub.nombre}</h3>
                                            {sub.descripcion && (
                                                <p className="text-sm text-deep-teal-50/60 line-clamp-2 mb-3">{sub.descripcion}</p>
                                            )}
                                            <div className="flex items-center gap-2 text-celadon-500 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                                                Ver Servicios y Paquetes <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            title="Próximamente"
                            message={`Estamos preparando experiencias increíbles en ${destino.nombre}. ¡Vuelve pronto!`}
                        />
                    )}
                </div>
            </section>

            {/* Gallery of destination images */}
            {destino.imagenes && destino.imagenes.length > 1 && (
                <section className="py-24 bg-coffee-bean-900/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-serif font-bold mb-12 text-center">Galería</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {destino.imagenes.map((img, idx) => (
                                <div key={img.id_imagen || idx} className="aspect-square rounded-xl overflow-hidden group">
                                    <img
                                        src={img.url}
                                        alt={img.alt_text || destino.nombre}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default DestinationDetail;
