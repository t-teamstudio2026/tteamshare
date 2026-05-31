export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Software {
  id: string;
  name: string;
  categoryId: string;
  logo: string;
  size: string;
  downloadUrl: string;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}
