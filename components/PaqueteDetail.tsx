
import React from 'react';
import { ArrowLeft, ChevronRight, Clock, Users, CheckCircle, PlusCircle, ArrowRight, DollarSign } from 'lucide-react';
import type { ApiPaquete, NavigationState } from '../types';
import { fetchPaqueteById, getEntityImage } from '../services/api';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface PaqueteDetailProps {
    paqueteId: string;
    destinoId?: string;
    subdestinoId?: string;
    onNavigate: (nav: NavigationState) => void;
}

const PaqueteDetail: React.FC<PaqueteDetailProps> = ({ paqueteId, destinoId, subdestinoId, onNavigate }) => {
    const { data: paquete, loading, error } = useApi<ApiPaquete>(
        () => fetchPaqueteById(paqueteId),
        [paqueteId]
    );

    if (loading) return <LoadingSpinner message="Cargando paquete..." count={1} />;

    if (error || !paquete) {
        return (
            <div className="pt-24">
                <EmptyState title="Error al cargar" message={error || 'No se pudo cargar el paquete.'} />
            </div>
        );
    }

    const heroImage = getEntityImage(paquete.imagenes, 'PAQUETE');
    const includedServices = paquete.servicios?.filter(s => s.es_opcional !== '1') || [];
    const optionalServices = paquete.servicios?.filter(s => s.es_opcional === '1') || [];

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative min-h-[55vh] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImage} alt={paquete.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950 via-deep-teal-950/60 to-transparent"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 pb-16 pt-32">
                    {/* Back */}
                    <button
                        onClick={() => {
                            if (subdestinoId) {
                                onNavigate({ view: 'subdestino', destinoId, subdestinoId });
                            } else if (destinoId) {
                                onNavigate({ view: 'destination', destinoId });
                            } else {
                                onNavigate({ view: 'home' });
                            }
                        }}
                        className="flex items-center gap-2 text-celadon-500 hover:text-celadon-400 transition-colors mb-6 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-deep-teal-50/50 text-sm mb-4">
                        <button onClick={() => onNavigate({ view: 'home' })} className="hover:text-celadon-500 transition-colors">Inicio</button>
                        {paquete.destino_nombre && (
                            <>
                                <ChevronRight size={14} />
                                <button
                                    onClick={() => { if (destinoId) onNavigate({ view: 'destination', destinoId }); }}
                                    className="hover:text-celadon-500 transition-colors"
                                >
                                    {paquete.destino_nombre}
                                </button>
                            </>
                        )}
                        {paquete.subdestino_nombre && (
                            <>
                                <ChevronRight size={14} />
                                <button
                                    onClick={() => { if (subdestinoId) onNavigate({ view: 'subdestino', destinoId, subdestinoId }); }}
                                    className="hover:text-celadon-500 transition-colors"
                                >
                                    {paquete.subdestino_nombre}
                                </button>
                            </>
                        )}
                        <ChevronRight size={14} />
                        <span className="text-celadon-500">{paquete.nombre}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                        {paquete.nombre}
                    </h1>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {paquete.duracion_horas && (
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                                <Clock size={14} className="text-celadon-500" />
                                {paquete.duracion_horas}h de duración
                            </span>
                        )}
                        {paquete.capacidad_maxima && (
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                                <Users size={14} className="text-celadon-500" />
                                Hasta {paquete.capacidad_maxima} personas
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 bg-deep-teal-950">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-16">
                        {/* Left: Description + Services */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Description */}
                            {paquete.descripcion && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-6">Descripción</h2>
                                    <p className="text-lg text-deep-teal-50/70 leading-relaxed">{paquete.descripcion}</p>
                                </div>
                            )}

                            {/* Included Services */}
                            {includedServices.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-6">Servicios Incluidos</h2>
                                    <div className="space-y-4">
                                        {includedServices.map(svc => (
                                            <div
                                                key={svc.id_servicio}
                                                className="flex items-start gap-4 bg-deep-teal-900/40 border border-deep-teal-800 p-5 rounded-xl"
                                            >
                                                <div className="w-10 h-10 shrink-0 bg-mint-leaf-400/20 rounded-full flex items-center justify-center">
                                                    <CheckCircle size={18} className="text-mint-leaf-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold mb-1">{svc.nombre}</h4>
                                                    {svc.descripcion && (
                                                        <p className="text-sm text-deep-teal-50/60">{svc.descripcion}</p>
                                                    )}
                                                    {svc.cantidad_incluida && parseInt(svc.cantidad_incluida) > 1 && (
                                                        <span className="text-xs text-celadon-500 mt-1 inline-block">
                                                            × {svc.cantidad_incluida} incluidos
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Optional Services */}
                            {optionalServices.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold mb-6">Servicios Opcionales</h2>
                                    <div className="space-y-4">
                                        {optionalServices.map(svc => (
                                            <div
                                                key={svc.id_servicio}
                                                className="flex items-start gap-4 bg-deep-teal-900/20 border border-dashed border-deep-teal-800 p-5 rounded-xl"
                                            >
                                                <div className="w-10 h-10 shrink-0 bg-celadon-500/10 rounded-full flex items-center justify-center">
                                                    <PlusCircle size={18} className="text-celadon-500" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold">{svc.nombre}</h4>
                                                        {svc.costo_adicional && parseFloat(svc.costo_adicional) > 0 && (
                                                            <span className="flex items-center gap-1 text-celadon-500 font-bold text-sm">
                                                                <DollarSign size={14} />
                                                                +${parseFloat(svc.costo_adicional).toFixed(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {svc.descripcion && (
                                                        <p className="text-sm text-deep-teal-50/60 mt-1">{svc.descripcion}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: CTA Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 bg-deep-teal-900/60 border border-deep-teal-800 rounded-2xl p-8 space-y-6">
                                <h3 className="text-xl font-serif font-bold">¿Te interesa este paquete?</h3>
                                <p className="text-deep-teal-50/60 text-sm leading-relaxed">
                                    Contáctanos para cotizar esta experiencia exclusiva y personalizarla a tu medida.
                                </p>
                                <div className="space-y-3">
                                    <button className="w-full bg-celadon-500 hover:bg-celadon-600 text-deep-teal-950 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-celadon-500/20">
                                        Cotizar Ahora
                                        <ArrowRight size={18} />
                                    </button>
                                    <button className="w-full border border-celadon-500/30 text-celadon-500 hover:bg-celadon-500/10 py-3 rounded-xl font-medium transition-colors text-sm">
                                        Personalizar Paquete
                                    </button>
                                </div>
                                <div className="text-xs text-deep-teal-50/40 text-center pt-2">
                                    Respuesta en menos de 24 horas
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image gallery */}
            {paquete.imagenes && paquete.imagenes.length > 1 && (
                <section className="py-24 bg-coffee-bean-900/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-serif font-bold mb-12 text-center">Galería del Paquete</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {paquete.imagenes.map((img, idx) => (
                                <div key={img.id_imagen || idx} className="aspect-video rounded-xl overflow-hidden group">
                                    <img
                                        src={img.url}
                                        alt={img.alt_text || paquete.nombre}
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

export default PaqueteDetail;
