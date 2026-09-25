import api from "./axios";

// =====================================================
// CATEGORY TYPE
// =====================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: Category | null;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const response = await api.post<{ success: boolean; category: Category }>("/categories", input);
  return response.data.category;
}

export async function updateCategory(id: string, input: Partial<CreateCategoryInput>): Promise<Category> {
  const response = await api.patch<{ success: boolean; category: Category }>(`/categories/${encodeURIComponent(id)}`, input);
  return response.data.category;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${encodeURIComponent(id)}`);
}

// =====================================================
// GET CATEGORY TREE
// =====================================================

export async function getCategoryTree(): Promise<Category[]> {
  const response = await api.get(
    "/categories/tree"
  );

  return response.data.categories;
}

// =====================================================
// GET CATEGORY BY ID
// =====================================================

export async function getCategoryById(id: string): Promise<Category> {
  if (!id?.trim()) {
    throw new Error("Category ID is required");
  }

  const response = await api.get<{ success: boolean; category: Category }>(
    `/categories/${encodeURIComponent(id)}`
  );

  return response.data.category;
}

// =====================================================
// GET CATEGORY BY SLUG
// =====================================================

export async function getCategoryBySlug(slug: string): Promise<Category> {
  if (!slug?.trim()) {
    throw new Error("Category slug is required");
  }

  const response = await api.get<{ success: boolean; category: Category }>(
    `/categories/slug/${encodeURIComponent(slug)}`
  );

  return response.data.category;
}

// =====================================================
// GET CATEGORY CHILDREN
// =====================================================

export async function getCategoryChildren(parentId: string): Promise<Category[]> {
  if (!parentId?.trim()) {
    throw new Error("Category ID is required");
  }

  const response = await api.get<{
    success: boolean;
    children: Category[];
  }>(
    `/categories/${encodeURIComponent(parentId)}/children`
  );

  return response.data.children;
}

// =====================================================
// SEARCH CATEGORIES
// =====================================================

export async function searchCategories(query: string): Promise<Category[]> {
  if (!query?.trim()) {
    return [];
  }

  const response = await api.get<{
    success: boolean;
    results: Category[];
  }>(
    "/categories/search",
    {
      params: {
        q: query
      }
    }
  );

  return response.data.results;
}