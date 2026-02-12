
import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { Testimonial } from './types';

export const WHY_US = [
  {
    title: 'Atención VIP Personalizada',
    desc: 'Un concierge dedicado a que cada detalle de tu viaje sea perfecto.',
    icon: <Sparkles className="w-8 h-8 text-celadon-500" />
  },
  {
    title: 'Seguridad y Confianza',
    desc: 'Operadores certificados y vehículos monitoreados para tu tranquilidad.',
    icon: <ShieldCheck className="w-8 h-8 text-celadon-500" />
  },
  {
    title: 'Experiencias Locales Reales',
    desc: 'Acceso a lugares y momentos que no encontrarás en guías tradicionales.',
    icon: <Navigation className="w-8 h-8 text-celadon-500" />
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alejandra Martínez',
    comment: 'La mejor experiencia en yate que he tenido. El servicio fue impecable y el personal muy atento.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: '2',
    name: 'David Wilson',
    comment: 'Professional staff, excellent logistics. They made our corporate retreat in Cartagena unforgettable.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=2'
  }
];
