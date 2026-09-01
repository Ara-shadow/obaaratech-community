// src/api/banner.ts
export interface BannerItem {
    id: string;
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    emoji?: string;
    isActive: boolean;
    displayOrder: number;
    link?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBannerData {
    title: string;
    description?: string;
    price?: number;
    currency?: string;
    emoji?: string;
    isActive?: boolean;
    displayOrder?: number;
    link?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem("token");
};

// API request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// Get all active banners for the homepage
export const getActiveBanners = async (): Promise<BannerItem[]> => {
    try {
        const data = await apiRequest<BannerItem[]>("/banners/active");
        return data;
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return [];
    }
};

// Admin: Get all banners
export const getAllBanners = async (): Promise<BannerItem[]> => {
    return apiRequest<BannerItem[]>("/banners");
};

// Admin: Create banner
export const createBanner = async (data: CreateBannerData): Promise<BannerItem> => {
    return apiRequest<BannerItem>("/banners", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// Admin: Update banner
export const updateBanner = async (id: string, data: Partial<CreateBannerData>): Promise<BannerItem> => {
    return apiRequest<BannerItem>(`/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

// Admin: Delete banner
export const deleteBanner = async (id: string): Promise<void> => {
    await apiRequest<void>(`/banners/${id}`, {
        method: "DELETE",
    });
};

// Admin: Toggle banner active status
export const toggleBanner = async (id: string): Promise<BannerItem> => {
    return apiRequest<BannerItem>(`/banners/${id}/toggle`, {
        method: "PATCH",
    });
};