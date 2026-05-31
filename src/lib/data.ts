import { Category, Software } from "@/types";
import categoriesRaw from "../../public/data/categories.json";
import softwareRaw from "../../public/data/software.json";

export function getStaticCategories(): Category[] {
  return categoriesRaw as Category[];
}

export function getStaticSoftware(): Software[] {
  return softwareRaw as Software[];
}

export function getSoftwareById(id: string): Software | undefined {
  const software = getStaticSoftware();
  return software.find((item) => item.id === id);
}

export function getSoftwareByCategory(categoryId: string): Software[] {
  const software = getStaticSoftware();
  return software.filter((item) => item.categoryId === categoryId);
}
