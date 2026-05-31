import React from "react";
import HomeContent from "@/components/HomeContent";
import { getStaticCategories, getStaticSoftware } from "@/lib/data";

export default function HomePage() {
  const categories = getStaticCategories();
  const software = getStaticSoftware();

  return <HomeContent categories={categories} software={software} />;
}
