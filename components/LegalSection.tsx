
import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Award, 
  FileCheck, 
  Leaf, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const LegalSection: React.FC = () => {
  return (
    <div className="flex flex-col bg-deep-teal-950">
      {/* 1. HERO — INTRODUCCIÓN LEGAL PREMIUM */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1520522139391-0f79534572de?q=80&w=2070&auto=format&fit=crop" 
            alt="Detalle náutico elegante" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-teal-950/20 via-deep-teal-950/80 to-deep-teal-950"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight animate-fade-in-up">
            Licencia de Turismo
          </h1>
          <p className="text-lg md:text-xl text-deep-teal-50/80 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
            En Cartagena Entertainment Rent and Pleasure, operamos bajo los más altos estándares de calidad y cumplimiento legal. Contamos con una Licencia de Turismo que respalda cada uno de nuestros servicios, garantizando que nuestras operaciones se realizan de manera ética, responsable y en conformidad con las regulaciones vigentes.
          </p>
        </div>
      </section>

      {/* 2. SECCIÓN — ¿QUÉ SIGNIFICA NUESTRA LICENCIA PARA TI? */}
      <section className="py-24 bg-deep-teal-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">¿Qué Significa Nuestra Licencia para Ti?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-deep-teal-900/40 border border-deep-teal-800 p-10 rounded-[2rem] hover:border-celadon-500/50 transition-all duration-500 group">
              <div className="w-14 h-14 tropical-gradient rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-deep-teal-950 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Seguridad y Confianza</h3>
              <p className="text-deep-teal-50/60 leading-relaxed">
                La licencia certifica que cumplimos con todos los requisitos legales, brindándote la tranquilidad de disfrutar de servicios seguros y confiables.
              </p>
            </div>

            <div className="bg-deep-teal-900/40 border border-deep-teal-800 p-10 rounded-[2rem] hover:border-celadon-500/50 transition-all duration-500 group">
              <div className="w-14 h-14 tropical-gradient rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Scale className="text-deep-teal-950 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Cumplimiento de Normas</h3>
              <p className="text-deep-teal-50/60 leading-relaxed">
                Nos aseguramos de operar bajo las leyes y regulaciones del sector turístico, promoviendo prácticas responsables y sostenibles.
              </p>
            </div>

            <div className="bg-deep-teal-900/40 border border-deep-teal-800 p-10 rounded-[2rem] hover:border-celadon-500/50 transition-all duration-500 group">
              <div className="w-14 h-14 tropical-gradient rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Award className="text-deep-teal-950 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Calidad Garantizada</h3>
              <p className="text-deep-teal-50/60 leading-relaxed">
                Nuestro compromiso con la excelencia está respaldado por certificaciones que avalan la calidad de nuestras experiencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN — ¿POR QUÉ ELEGIR UNA EMPRESA CON LICENCIA? */}
      <section className="py-24 bg-coffee-bean-900/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-10 leading-tight">
                ¿Por qué elegir una empresa con Licencia?
              </h2>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-celadon-500/10 rounded-full flex items-center justify-center border border-celadon-500/30">
                    <FileCheck className="text-celadon-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Protección al Cliente</h4>
                    <p className="text-deep-teal-50/60">Te asegura que estás contratando servicios con una empresa legítima y profesional.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-celadon-500/10 rounded-full flex items-center justify-center border border-celadon-500/30">
                    <Leaf className="text-celadon-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Experiencias Responsables</h4>
                    <p className="text-deep-teal-50/60">Promovemos un turismo ético, respetando el entorno, las comunidades locales y la cultura.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-celadon-500/10 rounded-full flex items-center justify-center border border-celadon-500/30">
                    <Sparkles className="text-celadon-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Transparencia</h4>
                    <p className="text-deep-teal-50/60">Operamos con claridad y honestidad en cada uno de nuestros servicios.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-deep-teal-800 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" 
                  alt="Persona firmando un documento legal" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 tropical-gradient rounded-full blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN — NUESTRO COMPROMISO */}
      <section className="py-24 bg-deep-teal-950">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">Nuestro Compromiso</h2>
          <div className="space-y-6 text-left inline-block">
            <div className="flex items-center gap-4 bg-deep-teal-900/30 p-6 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-mint-leaf-400 shrink-0" size={24} />
              <p className="text-lg text-deep-teal-50/80">Fomentar el desarrollo sostenible del turismo en la región.</p>
            </div>
            <div className="flex items-center gap-4 bg-deep-teal-900/30 p-6 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-mint-leaf-400 shrink-0" size={24} />
              <p className="text-lg text-deep-teal-50/80">Respetar y preservar el entorno natural y cultural del Caribe.</p>
            </div>
            <div className="flex items-center gap-4 bg-deep-teal-900/30 p-6 rounded-2xl border border-white/5">
              <CheckCircle2 className="text-mint-leaf-400 shrink-0" size={24} />
              <p className="text-lg text-deep-teal-50/80">Ofrecer a nuestros clientes experiencias únicas, seguras y memorables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN FINAL — MENSAJE DE CONFIANZA */}
      <section className="py-24 bg-deep-teal-950">
        <div className="container mx-auto px-6">
          <div className="bg-coffee-bean-800 p-12 md:p-20 rounded-[3rem] border border-white/5 relative overflow-hidden group">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-white">Viaja con Confianza y Tranquilidad</h2>
              <p className="text-xl text-white/70 leading-relaxed mb-0">
                Nuestra Licencia de Turismo es un reflejo de nuestra dedicación a la calidad, la seguridad y la responsabilidad. Al elegirnos, puedes estar seguro de que cada detalle de tu experiencia ha sido cuidadosamente planificado para superar tus expectativas.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-celadon-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl tropical-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-xl md:text-2xl text-deep-teal-950/80 mb-10 max-w-3xl mx-auto font-medium">
              ¡Contáctanos y descubre por qué somos la elección confiable para vivir el lujo y la exclusividad en el Caribe!
            </p>
            <button className="bg-deep-teal-950 text-celadon-500 px-12 py-5 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto">
              Contactar ahora
              <ArrowRight size={24} />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-teal-800/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default LegalSection;
