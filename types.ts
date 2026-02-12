
// ─── API Response Types ─────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ─── Core Entity Types (match DB columns) ───────────────────────

export interface ApiImagen {
  id_imagen: string;
  url: string;
  alt_text: string;
  orden: string;
  tipo_entidad: 'DESTINO' | 'SUBDESTINO' | 'SERVICIO' | 'PAQUETE';
  id_entidad: string;
  es_principal: string;
  activo: string;
}

export interface ApiDestino {
  id_destino: string;
  nombre: string;
  pais: string;
  descripcion: string;
  activo: string;
  // Included when fetching by ID
  total_subdestinos?: number;
  subdestinos?: ApiSubdestino[];
  imagenes?: ApiImagen[];
}

export interface ApiSubdestino {
  id_subdestino: string;
  nombre: string;
  descripcion: string;
  id_destino: string;
  latitud: string;
  longitud: string;
  activo: string;
  // JOIN fields
  destino_nombre?: string;
  destino_pais?: string;
  // Included when fetching by ID
  total_servicios?: number;
  total_paquetes?: number;
  servicios?: ApiServicio[];
  paquetes?: ApiPaquete[];
  imagenes?: ApiImagen[];
}

export interface ApiServicio {
  id_servicio: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  id_subdestino: string;
  disponible_independiente: string;
  activo: string;
  // JOIN fields
  subdestino_nombre?: string;
  // Included when fetching by ID
  imagenes?: ApiImagen[];
}

export interface ApiPaqueteServicio extends ApiServicio {
  es_opcional: string;
  costo_adicional: string;
  cantidad_incluida: string;
}

export interface ApiPaquete {
  id_paquete: string;
  nombre: string;
  descripcion: string;
  duracion_horas: string;
  capacidad_maxima: string;
  id_subdestino: string;
  activo: string;
  // JOIN fields
  subdestino_nombre?: string;
  destino_nombre?: string;
  // Included when fetching by ID
  servicios?: ApiPaqueteServicio[];
  imagenes?: ApiImagen[];
}

// ─── List response shapes ───────────────────────────────────────

export interface DestinosListResponse {
  destinos: ApiDestino[];
  pagination: PaginationInfo;
}

export interface SubdestinosListResponse {
  subdestinos: ApiSubdestino[];
  pagination: PaginationInfo;
}

export interface ServiciosListResponse {
  servicios: ApiServicio[];
  pagination: PaginationInfo;
}

export interface PaquetesListResponse {
  paquetes: ApiPaquete[];
  pagination: PaginationInfo;
}

// ─── Navigation Types ───────────────────────────────────────────

export type ViewType = 'home' | 'about' | 'legal' | 'destination' | 'subdestino' | 'paquete';

export interface NavigationState {
  view: ViewType;
  destinoId?: string;
  subdestinoId?: string;
  paqueteId?: string;
}

// ─── Static Data Types (kept for constants.tsx) ────────────────

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatar: string;
}
