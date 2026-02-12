
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Globe,
} from 'lucide-react';
import Navbar from './components/Navbar';
import PackageCard from './components/PackageCard';
import AboutSection from './components/AboutSection';
import LegalSection from './components/LegalSection';
import DestinationDetail from './components/DestinationDetail';
import SubdestinoDetail from './components/SubdestinoDetail';
import PaqueteDetail from './components/PaqueteDetail';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import { WHY_US, TESTIMONIALS } from './constants';
import { fetchDestinos, fetchPaquetes, getEntityImage } from './services/api';
import { useApi } from './hooks/useApi';
import type { NavigationState, DestinosListResponse, PaquetesListResponse } from './types';

const App: React.FC = () => {
  const [nav, setNav] = useState<NavigationState>({ view: 'home' });

  const handleNavigate = (newNav: NavigationState) => {
    setNav(newNav);
    window.scrollTo(0, 0);
  };

  const LandingContent = () => {
    const { data: destinosData, loading: loadingDest } = useApi<DestinosListResponse>(
      () => fetchDestinos(),
      []
    );
    const { data: paquetesData, loading: loadingPkg } = useApi<PaquetesListResponse>(
      () => fetchPaquetes(),
      []
    );

    const destinos = destinosData?.destinos || [];
    const paquetes = paquetesData?.paquetes || [];

    return (
      <>
        {/* 1. HERO SECTION */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1596422846543-75c6fc18a594?q=80&w=2070&auto=format&fit=crop"
              alt="Cartagena"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 hero-overlay"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
              Atrévete a vivir tu aventura en el <span className="text-celadon-500">corazón del caribe</span>
            </h1>
            <p className="text-lg md:text-xl text-deep-teal-50/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Descubre el lujo accesible en el corazón del Caribe. Turismo, entretenimiento y servicios premium diseñados exclusivamente para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <a
                href="#destinations"
                className="bg-celadon-500 hover:bg-celadon-600 text-deep-teal-950 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Explorar Destinos
                <ArrowRight size={20} />
              </a>
              <button
                onClick={() => handleNavigate({ view: 'about' })}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
              >
                Personaliza tu Experiencia
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
            <div className="w-6 h-10 border-2 border-celadon-500 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-celadon-500 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT SHORT */}
        <section id="about-intro" className="py-24 bg-deep-teal-950">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Sobre Nosotros</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                  Llevamos el concepto de <span className="italic">placer</span> a un nuevo nivel
                </h2>
                <p className="text-lg text-deep-teal-50/70 mb-6 leading-relaxed">
                  Cartagena Entertainment Rent And Pleasure nació con una misión clara: transformar cada viaje en una memoria eterna. No solo alquilamos servicios; diseñamos momentos exclusivos donde la comodidad y la aventura convergen.
                </p>
                <button
                  onClick={() => handleNavigate({ view: 'about' })}
                  className="text-celadon-500 font-bold flex items-center gap-2 group"
                >
                  Conocer más sobre nosotros <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-deep-teal-800 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=1974&auto=format&fit=crop"
                    alt="Luxury Experience"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DESTINOS — FROM API */}
        <section id="destinations" className="py-24 bg-coffee-bean-900/30">
          <div className="container mx-auto px-6 text-center">
            <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Explora</span>
            <h2 className="text-4xl font-serif font-bold mb-12">Destinos para Enamorarse</h2>

            {loadingDest ? (
              <LoadingSpinner message="Cargando destinos..." count={3} />
            ) : destinos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinos.map(dest => {
                  const image = getEntityImage(dest.imagenes, 'DESTINO');
                  return (
                    <div
                      key={dest.id_destino}
                      onClick={() => handleNavigate({ view: 'destination', destinoId: dest.id_destino })}
                      className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-celadon-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-celadon-500/10"
                    >
                      <img src={image} alt={dest.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950 via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full text-left">
                        <div className="flex items-center gap-2 text-celadon-500/70 text-xs uppercase tracking-wider mb-2">
                          <Globe size={12} />
                          {dest.pais}
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-2">{dest.nombre}</h3>
                        <p className="text-sm text-deep-teal-50/60 line-clamp-2 mb-3">{dest.descripcion}</p>
                        <div className="flex items-center gap-2 text-celadon-500 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                          Explorar <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Destinos en preparación"
                message="Estamos preparando destinos increíbles. ¡Vuelve pronto!"
              />
            )}
          </div>
        </section>

        {/* 4. PAQUETES — FROM API */}
        <section id="packages" className="py-24 bg-deep-teal-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Ofertas</span>
              <h2 className="text-4xl font-serif font-bold">Experiencias Destacadas</h2>
            </div>

            {loadingPkg ? (
              <LoadingSpinner message="Cargando paquetes..." count={3} />
            ) : paquetes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {paquetes.map(pkg => (
                  <PackageCard
                    key={pkg.id_paquete}
                    paquete={pkg}
                    onViewDetail={() => handleNavigate({
                      view: 'paquete',
                      paqueteId: pkg.id_paquete,
                      subdestinoId: pkg.id_subdestino,
                    })}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Paquetes en preparación"
                message="Estamos diseñando experiencias exclusivas. ¡Contáctanos para una experiencia personalizada!"
              />
            )}
          </div>
        </section>

        {/* 5. WHY US */}
        <section className="py-24 bg-coffee-bean-900/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Ventajas</span>
              <h2 className="text-4xl font-serif font-bold">¿Por qué Elegirnos?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {WHY_US.map((item, idx) => (
                <div key={idx} className="bg-deep-teal-900/40 border border-deep-teal-800 p-10 rounded-2xl hover:border-celadon-500/50 transition-all duration-500 group text-center">
                  <div className="w-16 h-16 tropical-gradient rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                    <span className="text-deep-teal-950">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                  <p className="text-deep-teal-50/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl tropical-gradient rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-deep-teal-950 mb-8">
                Tu experiencia en el Caribe comienza aquí
              </h2>
              <button className="bg-deep-teal-950 text-celadon-500 px-12 py-5 rounded-full font-bold text-xl shadow-2xl flex items-center gap-3 mx-auto hover:scale-105 transition-transform">
                Cotizar mi Experiencia
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-teal-800/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-deep-teal-950">
      <Navbar currentNav={nav} onNavigate={handleNavigate} />

      <main className="flex-grow">
        {nav.view === 'home' && <LandingContent />}
        {nav.view === 'about' && <AboutSection />}
        {nav.view === 'legal' && <LegalSection />}
        {nav.view === 'destination' && nav.destinoId && (
          <DestinationDetail destinoId={nav.destinoId} onNavigate={handleNavigate} />
        )}
        {nav.view === 'subdestino' && nav.subdestinoId && (
          <SubdestinoDetail
            subdestinoId={nav.subdestinoId}
            destinoId={nav.destinoId}
            onNavigate={handleNavigate}
          />
        )}
        {nav.view === 'paquete' && nav.paqueteId && (
          <PaqueteDetail
            paqueteId={nav.paqueteId}
            destinoId={nav.destinoId}
            subdestinoId={nav.subdestinoId}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer id="footer" className="bg-deep-teal-950 pt-24 pb-12 border-t border-deep-teal-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1">
              <div
                className="flex items-center gap-2 mb-8 cursor-pointer"
                onClick={() => handleNavigate({ view: 'home' })}
              >
                <img
                  src="/Logo_CERP.webp"
                  alt="CERP Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-lg font-serif font-bold tracking-tight">
                  Cartagena Entertainment <span className="text-celadon-500">Rent and Pleasure</span>
                </span>
              </div>
              <p className="text-deep-teal-50/50 text-sm leading-relaxed mb-8">
                Lujo accesible y experiencias personalizadas en el Caribe colombiano.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-8 uppercase tracking-widest text-sm text-celadon-500">Empresa</h5>
              <ul className="space-y-4 text-deep-teal-50/60 text-sm">
                <li><button onClick={() => handleNavigate({ view: 'about' })} className="hover:text-celadon-500">Sobre Nosotros</button></li>
                <li><button onClick={() => handleNavigate({ view: 'about' })} className="hover:text-celadon-500">Misión y Visión</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-8 uppercase tracking-widest text-sm text-celadon-500">Legal</h5>
              <ul className="space-y-4 text-deep-teal-50/60 text-sm">
                <li><button onClick={() => handleNavigate({ view: 'legal' })} className="hover:text-celadon-500">Licencia de Turismo</button></li>
                <li><a href="#" className="hover:text-celadon-500">Términos y Condiciones</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-8 uppercase tracking-widest text-sm text-celadon-500">Contacto</h5>
              <ul className="space-y-4 text-deep-teal-50/60 text-sm">
                <li>Cartagena de Indias, Colombia</li>
                <li>hello@cartagenarent.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-deep-teal-900 text-center flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-deep-teal-50/30 text-xs italic">
              © 2024 Cartagena Entertainment Rent And Pleasure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
