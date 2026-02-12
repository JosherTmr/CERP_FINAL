
import type {
    ApiResponse,
    ApiDestino,
    ApiSubdestino,
    ApiServicio,
    ApiPaquete,
    DestinosListResponse,
    SubdestinosListResponse,
    ServiciosListResponse,
    PaquetesListResponse,
} from '../types';

// ─── Configuration ──────────────────────────────────────────────

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL
    || 'https://cartagenaentertainmentrentandpleasure.com/api';

// ─── Generic Fetch Helper ───────────────────────────────────────

async function apiFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const json: ApiResponse<T> = await response.json();

    if (!json.success) {
        throw new Error(json.error || 'Error desconocido de la API');
    }

    return json.data;
}

// ─── Destinos ───────────────────────────────────────────────────

export async function fetchDestinos(search?: string): Promise<DestinosListResponse> {
    const params: Record<string, string> = { activo: '1', limit: '50' };
    if (search) params.search = search;
    return apiFetch<DestinosListResponse>('/endpoints/destinos/index.php', params);
}

export async function fetchDestinoById(id: string): Promise<ApiDestino> {
    return apiFetch<ApiDestino>(`/endpoints/destinos/index.php/${id}`);
}

// ─── Subdestinos ────────────────────────────────────────────────

export async function fetchSubdestinos(idDestino?: string): Promise<SubdestinosListResponse> {
    const params: Record<string, string> = { activo: '1', limit: '50' };
    if (idDestino) params.id_destino = idDestino;
    return apiFetch<SubdestinosListResponse>('/endpoints/subdestinos/index.php', params);
}

export async function fetchSubdestinoById(id: string): Promise<ApiSubdestino> {
    return apiFetch<ApiSubdestino>(`/endpoints/subdestinos/index.php/${id}`);
}

// ─── Servicios ──────────────────────────────────────────────────

export async function fetchServicios(idSubdestino?: string, tipo?: string): Promise<ServiciosListResponse> {
    const params: Record<string, string> = { activo: '1', limit: '50' };
    if (idSubdestino) params.id_subdestino = idSubdestino;
    if (tipo) params.tipo = tipo;
    return apiFetch<ServiciosListResponse>('/endpoints/servicios/index.php', params);
}

export async function fetchServicioById(id: string): Promise<ApiServicio> {
    return apiFetch<ApiServicio>(`/endpoints/servicios/index.php/${id}`);
}

// ─── Paquetes ───────────────────────────────────────────────────

export async function fetchPaquetes(idSubdestino?: string): Promise<PaquetesListResponse> {
    const params: Record<string, string> = { activo: '1', limit: '50' };
    if (idSubdestino) params.id_subdestino = idSubdestino;
    return apiFetch<PaquetesListResponse>('/endpoints/paquetes/index.php', params);
}

export async function fetchPaqueteById(id: string): Promise<ApiPaquete> {
    return apiFetch<ApiPaquete>(`/endpoints/paquetes/index.php/${id}`);
}

// ─── Image Helpers ──────────────────────────────────────────────

/** Default fallback images per entity type */
const FALLBACK_IMAGES: Record<string, string> = {
    DESTINO: 'https://static.vecteezy.com/system/resources/thumbnails/012/508/173/small/paradise-island-beach-tropical-landscape-of-summer-scenic-sea-sand-sky-with-palm-trees-luxury-travel-vacation-destination-exotic-beach-landscape-amazing-nature-relax-freedom-nature-template-photo.jpg',
    SUBDESTINO: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=800&auto=format&fit=crop',
    SERVICIO: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    PAQUETE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    DEFAULT: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?q=80&w=800&auto=format&fit=crop',
};

export function getEntityImage(
    imagenes?: Array<{ url: string; es_principal?: string }>,
    entityType?: string
): string {
    if (imagenes && imagenes.length > 0) {
        const principal = imagenes.find(img => img.es_principal === '1');
        return principal?.url || imagenes[0].url;
    }
    return FALLBACK_IMAGES[entityType || 'DEFAULT'] || FALLBACK_IMAGES.DEFAULT;
}
