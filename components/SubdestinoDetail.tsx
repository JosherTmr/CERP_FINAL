
import React from 'react';
import { ArrowLeft, MapPin, ChevronRight, Clock, Compass } from 'lucide-react';
import type { ApiSubdestino, NavigationState } from '../types';
import { fetchSubdestinoById } from '../services/api';
import { getEntityImage } from '../services/api';
import { useApi } from '../hooks/useApi';
import PackageCard from './PackageCard';
import ServiceCard from './ServiceCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface SubdestinoDetailProps {
    subdestinoId: string;
    destinoId?: string;
    onNavigate: (nav: NavigationState) => void;
}

const SubdestinoDetail: React.FC<SubdestinoDetailProps> = ({ subdestinoId, destinoId, onNavigate }) => {
    const { data: subdestino, loading, error } = useApi<ApiSubdestino>(
        () => fetchSubdestinoById(subdestinoId),
        [subdestinoId]
    );

    if (loading) return <LoadingSpinner message="Cargando zona..." count={3} />;

    if (error || !subdestino) {
        return (
            <div className="pt-24">
                <EmptyState title="Error al cargar" message={error || 'No se pudo cargar la información.'} />
            </div>
        );
    }

    const heroImage = getEntityImage(subdestino.imagenes, 'SUBDESTINO');
    const hasPaquetes = subdestino.paquetes && subdestino.paquetes.length > 0;
    const hasServicios = subdestino.servicios && subdestino.servicios.length > 0;

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative min-h-[55vh] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt={subdestino.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950 via-deep-teal-950/60 to-transparent"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 pb-16 pt-32">
                    {/* Back button */}
                    <button
                        onClick={() => {
                            if (destinoId) {
                                onNavigate({ view: 'destination', destinoId });
                            } else {
                                onNavigate({ view: 'home' });
                            }
                        }}
                        className="flex items-center gap-2 text-celadon-500 hover:text-celadon-400 transition-colors mb-6 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">
                            {subdestino.destino_nombre ? `Volver a ${subdestino.destino_nombre}` : 'Volver'}
                        </span>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-deep-teal-50/50 text-sm mb-4">
                        <button
                            onClick={() => onNavigate({ view: 'home' })}
                            className="hover:text-celadon-500 transition-colors"
                        >
                            Inicio
                        </button>
                        <ChevronRight size={14} />
                        {subdestino.destino_nombre && (
                            <>
                                <button
                                    onClick={() => {
                                        if (subdestino.id_destino) {
                                            onNavigate({ view: 'destination', destinoId: subdestino.id_destino });
                                        }
                                    }}
                                    className="hover:text-celadon-500 transition-colors"
                                >
                                    {subdestino.destino_nombre}
                                </button>
                                <ChevronRight size={14} />
                            </>
                        )}
                        <span className="text-celadon-500">{subdestino.nombre}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                        {subdestino.nombre}
                    </h1>
                    {subdestino.descripcion && (
                        <p className="text-lg text-deep-teal-50/70 max-w-3xl leading-relaxed">
                            {subdestino.descripcion}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-6">
                        {subdestino.destino_pais && (
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                                <MapPin size={14} className="text-celadon-500" />
                                {subdestino.destino_pais}
                            </span>
                        )}
                        {subdestino.total_paquetes !== undefined && (
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                                <Compass size={14} className="text-celadon-500" />
                                {subdestino.total_paquetes} Paquetes
                            </span>
                        )}
                        {subdestino.total_servicios !== undefined && (
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                                <Clock size={14} className="text-celadon-500" />
                                {subdestino.total_servicios} Servicios
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Paquetes Section */}
            <section className="py-24 bg-deep-teal-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
                            Experiencias
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">
                            Paquetes en {subdestino.nombre}
                        </h2>
                    </div>

                    {hasPaquetes ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {subdestino.paquetes!.map(pkg => (
                                <PackageCard
                                    key={pkg.id_paquete}
                                    paquete={pkg}
                                    onViewDetail={() => onNavigate({
                                        view: 'paquete',
                                        destinoId,
                                        subdestinoId,
                                        paqueteId: pkg.id_paquete
                                    })}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Paquetes en preparación"
                            message="Estamos diseñando experiencias exclusivas para esta zona. ¡Contáctanos para una experiencia personalizada!"
                        />
                    )}
                </div>
            </section>

            {/* Servicios Section */}
            <section className="py-24 bg-coffee-bean-900/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
                            A tu medida
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">
                            Servicios Disponibles
                        </h2>
                    </div>

                    {hasServicios ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subdestino.servicios!.map(svc => (
                                <ServiceCard key={svc.id_servicio} service={svc} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Servicios próximamente"
                            message="Estamos incorporando servicios individuales para esta zona. ¡Contáctanos para más información!"
                        />
                    )}
                </div>
            </section>

            {/* Image gallery */}
            {subdestino.imagenes && subdestino.imagenes.length > 1 && (
                <section className="py-24 bg-deep-teal-950">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-serif font-bold mb-12 text-center">Galería</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subdestino.imagenes.map((img, idx) => (
                                <div key={img.id_imagen || idx} className="aspect-square rounded-xl overflow-hidden group">
                                    <img
                                        src={img.url}
                                        alt={img.alt_text || subdestino.nombre}
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

export default SubdestinoDetail;
