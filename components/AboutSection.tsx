
import React from 'react';
import { 
  Medal, 
  ShieldCheck, 
  Heart, 
  UserCheck, 
  Globe, 
  Lightbulb, 
  Handshake, 
  Users, 
  Sun,
  ArrowRight
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const values = [
    {
      title: 'Compromiso con la Excelencia',
      desc: 'Nos esforzamos por ofrecer servicios de la más alta calidad.',
      icon: <Medal className="w-6 h-6" />
    },
    {
      title: 'Seguridad ante Todo',
      desc: 'Tu seguridad y tranquilidad son nuestra máxima prioridad.',
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: 'Pasión por el Lujo',
      desc: 'Creamos experiencias únicas para quienes buscan lo mejor.',
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: 'Atención Personalizada',
      desc: 'Nos dedicamos a entender y satisfacer tus deseos.',
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      title: 'Responsabilidad Social',
      desc: 'Respetamos el entorno natural y cultural que nos rodea.',
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: 'Innovación Constante',
      desc: 'Nos adaptamos a tus necesidades con creatividad.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: 'Integridad y Transparencia',
      desc: 'Actuamos con honestidad y ética en todo momento.',
      icon: <Handshake className="w-6 h-6" />
    },
    {
      title: 'Trabajo en Equipo',
      desc: 'Fomentamos un ambiente de colaboración y respeto.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Alegría y Entusiasmo',
      desc: 'Transmitimos la energía vibrante del Caribe.',
      icon: <Sun className="w-6 h-6" />
    }
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO - INTRODUCCIÓN DE MARCA */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1583531172005-814191b8b6c0?q=80&w=2070&auto=format&fit=crop" 
            alt="Atardecer Caribeño" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight animate-fade-in-up">
            Sobre Cartagena Entertainment <span className="text-celadon-500">Rent and Pleasure</span>
          </h1>
          <p className="text-lg md:text-xl text-deep-teal-50/80 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-200">
            Somos más que una empresa de alquiler: somos tus arquitectos de momentos inolvidables en el corazón del Caribe. Nos especializamos en curar experiencias de lujo que combinan aventura, confort y exclusividad.
          </p>
        </div>
      </section>

      {/* 2. MISIÓN Y VISIÓN */}
      <section className="py-24 bg-deep-teal-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="bg-white/5 p-10 md:p-14 rounded-[2rem] border border-white/10 hover:border-celadon-500/50 transition-all duration-500 group">
              <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block group-hover:translate-x-2 transition-transform">Propósito</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Nuestra Misión</h2>
              <p className="text-lg text-deep-teal-50/70 leading-relaxed">
                Ofrecer experiencias de lujo y entretenimiento que superen todas las expectativas, a través de una exclusiva gama de yates, propiedades y vehículos. Estamos respaldados por un firme compromiso con la calidad, la seguridad y la responsabilidad, garantizando que cada momento sea inolvidable.
              </p>
            </div>
            <div className="bg-white/5 p-10 md:p-14 rounded-[2rem] border border-white/10 hover:border-celadon-500/50 transition-all duration-500 group">
              <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block group-hover:translate-x-2 transition-transform">Futuro</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Nuestra Visión</h2>
              <p className="text-lg text-deep-teal-50/70 leading-relaxed">
                Ser la empresa líder global en el mercado del lujo y el entretenimiento, reconocida por nuestra excelencia en el servicio, la calidad de nuestra flota y nuestra capacidad para crear experiencias personalizadas. Aspiramos a ser el referente principal para quienes buscan placer y aventura en el Caribe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTRA INSPIRACIÓN */}
      <section className="py-24 bg-coffee-bean-900/40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1589133967013-390f77918231?q=80&w=1974&auto=format&fit=crop" 
                  alt="Inspiración Caribeña - Mujer con traje típico" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal-950/40 to-transparent"></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-celadon-500 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">Legado y Cultura</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Nuestra Inspiración</h2>
              <p className="text-lg md:text-xl text-deep-teal-50/70 leading-relaxed mb-8">
                Nos guiamos por la energía vibrante de la cultura caribeña. Los colores de nuestro logo son un homenaje a las noches mágicas del Festival de la Luna Verde de San Andrés, una celebración que resalta las tradiciones, la alegría y el entusiasmo de las raíces afrocaribeñas. Esta riqueza cultural es la que inspira cada experiencia que creamos.
              </p>
              <div className="w-20 h-1 bg-celadon-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALORES QUE NOS DEFINEN */}
      <section className="py-24 bg-deep-teal-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Valores que Nos Definen</h2>
            <p className="text-deep-teal-50/50 max-w-2xl mx-auto">La brújula que guía nuestro servicio excepcional y nuestra ética empresarial.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-celadon-500 group transition-all duration-500">
                <div className="w-14 h-14 tropical-gradient rounded-xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-celadon-500 transition-colors">
                  <span className="text-deep-teal-950 group-hover:text-celadon-600 transition-colors">
                    {val.icon}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-deep-teal-950 transition-colors">{val.title}</h3>
                <p className="text-deep-teal-50/60 group-hover:text-deep-teal-950/80 transition-colors">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl tropical-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-deep-teal-950 mb-10">
              Tu experiencia inolvidable comienza con nosotros.
            </h2>
            <button className="bg-deep-teal-950 text-celadon-500 px-12 py-5 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto">
              Cotizar mi experiencia
              <ArrowRight size={24} />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-teal-800/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
