import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaticCategories, getStaticSoftware } from "@/lib/data";
import DownloadCardContent from "@/components/DownloadCardContent";

interface SoftwarePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const software = getStaticSoftware();
  return software.map((sw) => ({
    id: sw.id,
  }));
}

export default async function SoftwareDetailPage({ params }: SoftwarePageProps) {
  const resolvedParams = await params;
  const categories = getStaticCategories();
  const software = getStaticSoftware();

  const sw = software.find((item) => item.id === resolvedParams.id);
  if (!sw) {
    notFound();
  }

  const category = categories.find((cat) => cat.id === sw.categoryId);

  // Format date
  const formattedDate = new Date(sw.updatedAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb / Navigation links */}
      <div className="flex items-center space-x-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.id}`} className="hover:text-white transition-colors">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-200 truncate font-medium">{sw.name}</span>
      </div>

      {/* Main Download Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/10 p-8 sm:p-12 space-y-8 shadow-2xl shadow-slate-950/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(56,153,211,0.08),rgba(255,255,255,0))]" />
        
        {/* Info Header */}
        <div className="relative flex flex-col sm:flex-row items-center text-center sm:text-left space-y-6 sm:space-y-0 sm:space-x-8">
          <div className="h-28 w-28 rounded-2xl bg-slate-950 border border-slate-850 p-4 flex items-center justify-center shrink-0 shadow-2xl shadow-slate-950/70">
            <img
              src={sw.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80"}
              alt={sw.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="space-y-3 min-w-0 flex-1">
            {category && (
              <Link
                href={`/category/${category.id}`}
                className="inline-block rounded bg-[#3899D3]/10 text-xs text-[#3899D3] px-3 py-1 font-semibold hover:bg-[#3899D3]/20 transition-colors"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {sw.name}
            </h1>
          </div>
        </div>

        <DownloadCardContent
          softwareId={sw.id}
          size={sw.size}
          formattedDate={formattedDate}
          initialDownloadsCount={sw.downloadsCount}
          downloadUrl={sw.downloadUrl}
        />
      </div>
    </div>
  );
}
