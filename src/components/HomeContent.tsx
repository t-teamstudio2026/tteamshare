"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Category, Software } from "@/types";
import CategoryIcon from "./CategoryIcon";
import { Search, ArrowRight, Download, Calendar, Flame, AlertCircle } from "lucide-react";

interface HomeContentProps {
  categories: Category[];
  software: Software[];
}

export default function HomeContent({ categories, software }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get count of softwares per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = 0;
    });
    software.forEach((sw) => {
      if (counts[sw.categoryId] !== undefined) {
        counts[sw.categoryId]++;
      }
    });
    return counts;
  }, [categories, software]);

  // Filter software based on search
  const filteredSoftware = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return software.filter(
      (sw) =>
        sw.name.toLowerCase().includes(query)
    );
  }, [searchQuery, software]);

  // Sort by updatedAt for new updates (most recent first)
  const newUpdates = useMemo(() => {
    return [...software]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [software]);

  // Sort by downloadsCount for top downloads
  const topDownloads = useMemo(() => {
    return [...software]
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, 6);
  }, [software]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Search Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,153,211,0.15),rgba(255,255,255,0))]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            Tải Phần Mềm Miễn Phí <br />
            <span className="bg-gradient-to-r from-[#3899D3] to-blue-400 bg-clip-text text-transparent">
              Tốc Độ Cao & An Toàn
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            Tất cả phần mềm đều được chọn lọc, kiểm tra mã độc và cung cấp liên kết trực tiếp không quảng cáo gây khó chịu, Lưu Ý Tất cả đều là bản quyền không phải crack.
          </p>

          {/* Search Box */}
          <div className="mx-auto max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 focus-within:border-[#3899D3]/50 focus-within:ring-1 focus-within:ring-[#3899D3]/50 backdrop-blur transition-all duration-300">
              <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm (ví dụ: Photoshop, AutoCad, Office...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-500 focus:outline-none text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Search Results */}
        {searchQuery && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-[#3899D3]" />
              <h2 className="text-xl font-bold text-white">
                Kết quả tìm kiếm cho: &quot;{searchQuery}&quot;
              </h2>
            </div>

            {filteredSoftware.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSoftware.map((sw) => (
                  <SoftwareCard key={sw.id} sw={sw} categoryName={categories.find(c => c.id === sw.categoryId)?.name || ""} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-900 bg-slate-950 p-12 text-center max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Không tìm thấy phần mềm</h3>
                <p className="text-sm text-slate-500">
                  Thử tìm kiếm với từ khóa khác hoặc duyệt qua danh mục bên dưới.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Categories Grid */}
        <section id="categories-section" className="space-y-8 scroll-mt-24">
          <div className="flex items-baseline justify-between border-b border-slate-900 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">Danh Mục Phần Mềm</h2>
            <span className="text-sm text-slate-500">{categories.length} danh mục</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 p-6 glow-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 group-hover:bg-[#3899D3]/10 border border-slate-800 group-hover:border-[#3899D3]/30 transition-colors duration-300">
                    <CategoryIcon name={category.icon} className="h-6 w-6 text-slate-400 group-hover:text-[#3899D3] transition-colors" />
                  </div>
                  <span className="rounded-full bg-slate-900 border border-slate-800 group-hover:border-[#3899D3]/20 px-2.5 py-0.5 text-xs text-slate-400 group-hover:text-[#3899D3] font-medium transition-colors">
                    {categoryCounts[category.id] || 0} sản phẩm
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-[#3899D3] transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[#3899D3] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Duyệt danh mục</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Updated & Top Download Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recently Updated */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-4">
              <Calendar className="h-5 w-5 text-[#3899D3]" />
              <h2 className="text-xl font-bold text-white">Mới Cập Nhật</h2>
            </div>

            <div className="space-y-4">
              {newUpdates.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/10 p-4 hover:bg-slate-900/30 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <img
                      src={sw.logo || "/favicon.ico"}
                      alt={sw.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=48&q=80";
                      }}
                      className="h-10 w-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800"
                    />
                    <div className="min-w-0">
                      <Link href={`/software/${sw.id}`} className="font-semibold text-white hover:text-[#3899D3] transition-colors truncate block">
                        {sw.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span>{sw.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">

                    <Link
                      href={`/software/${sw.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 hover:bg-[#3899D3] text-slate-400 hover:text-white border border-slate-850 hover:border-[#3899D3] transition-all"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Downloads */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-4">
              <Flame className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-white">Top Download</h2>
            </div>

            <div className="space-y-4">
              {topDownloads.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/10 p-4 hover:bg-slate-900/30 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <img
                      src={sw.logo || "/favicon.ico"}
                      alt={sw.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=48&q=80";
                      }}
                      className="h-10 w-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800"
                    />
                    <div className="min-w-0">
                      <Link href={`/software/${sw.id}`} className="font-semibold text-white hover:text-[#3899D3] transition-colors truncate block">
                        {sw.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span>{sw.size}</span>
                        <span>&bull;</span>
                        <span className="flex items-center text-amber-400">
                          <Flame className="h-3 w-3 mr-0.5 fill-amber-400/20" />
                          {sw.downloadsCount.toLocaleString('vi-VN')} tải
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/software/${sw.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 hover:bg-[#3899D3] text-slate-400 hover:text-white border border-slate-850 hover:border-[#3899D3] transition-all shrink-0"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Inline component to keep it modular but single file for simplicity
function SoftwareCard({ sw, categoryName }: { sw: Software; categoryName: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 p-5 glow-hover flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center">
            <img
              src={sw.logo || "/favicon.ico"}
              alt={sw.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=48&q=80";
              }}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded bg-[#3899D3]/10 text-[10px] text-[#3899D3] px-2 py-0.5 font-semibold">
              {categoryName}
            </span>

          </div>
        </div>

        <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#3899D3] transition-colors duration-200">
          {sw.name}
        </h3>

      </div>

      <div className="mt-5 border-t border-slate-900/60 pt-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span>{sw.size}</span>
        </div>
        <Link
          href={`/software/${sw.id}`}
          className="flex items-center space-x-1 font-semibold text-[#3899D3] hover:text-sky-400 transition-colors"
        >
          <span>Tải về</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
