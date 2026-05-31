import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaticCategories, getStaticSoftware } from "@/lib/data";
import CategoryIcon from "@/components/CategoryIcon";
import { ArrowLeft, ArrowRight, Download, Layers } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const categories = getStaticCategories();
  return categories.map((cat) => ({
    id: cat.id,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categories = getStaticCategories();
  const software = getStaticSoftware();

  const category = categories.find((cat) => cat.id === resolvedParams.id);
  if (!category) {
    notFound();
  }

  const categorySoftware = software.filter((sw) => sw.categoryId === resolvedParams.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Back to Home Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      {/* Category Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(139,92,246,0.08),rgba(255,255,255,0))]" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/30 shadow-lg shadow-violet-500/10">
              <CategoryIcon name={category.icon} className="h-8 w-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {category.name}
              </h1>
              <p className="mt-2 text-slate-400 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-sm text-slate-400 font-semibold">
            {categorySoftware.length} sản phẩm
          </span>
        </div>
      </div>

      {/* Software Grid */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-900 pb-4">
          <Layers className="h-5 w-5 text-slate-500" />
          <h2 className="text-xl font-bold text-white">Danh Sách Phần Mềm</h2>
        </div>

        {categorySoftware.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySoftware.map((sw) => (
              <div
                key={sw.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 p-5 glow-hover flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center">
                      <img
                        src={sw.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=48&q=80"}
                        alt={sw.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded bg-violet-500/10 text-[10px] text-violet-400 px-2 py-0.5 font-semibold">
                        {category.name}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white group-hover:text-violet-400 transition-colors duration-200">
                    {sw.name}
                  </h3>
                </div>

                <div className="mt-5 border-t border-slate-900/60 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span>{sw.size}</span>
                  </div>
                  <Link
                    href={`/software/${sw.id}`}
                    className="flex items-center space-x-1 font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <span>Tải về</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-16 text-center max-w-md mx-auto">
            <Layers className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Chưa có phần mềm nào</h3>
            <p className="text-sm text-slate-500">
              Admin hiện chưa cập nhật phần mềm cho danh mục này. Vui lòng quay lại sau!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
