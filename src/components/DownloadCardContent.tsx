"use client";
import React, { useState, useEffect } from "react";
import { Download, HardDrive, Calendar, Flame, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DownloadCardContentProps {
  softwareId: string;
  size: string;
  formattedDate: string;
  initialDownloadsCount: number;
  downloadUrl?: string;
}

export default function DownloadCardContent({
  softwareId,
  size,
  formattedDate,
  initialDownloadsCount,
  downloadUrl,
}: DownloadCardContentProps) {
  const [downloadsCount, setDownloadsCount] = useState(initialDownloadsCount);

  useEffect(() => {
    const storedCount = localStorage.getItem(`download_count_${softwareId}`);
    if (storedCount) {
      setDownloadsCount(Number(storedCount));
    } else {
      setDownloadsCount(initialDownloadsCount);
    }
  }, [softwareId, initialDownloadsCount]);

  const handleDownloadClick = async () => {
    try {
      await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: softwareId }),
      });

      const newCount = downloadsCount + 1;
      setDownloadsCount(newCount);
      localStorage.setItem(`download_count_${softwareId}`, String(newCount));
    } catch (err) {
      console.error("Failed to track download count:", err);
    }
  };

  return (
    <>
      {/* Specs Row */}
      <div className="relative grid grid-cols-3 gap-4 border-t border-b border-slate-900 py-6 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <HardDrive className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Dung Lượng</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white">{size}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Cập Nhật</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white">{formattedDate}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <Flame className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Lượt Tải</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white">{downloadsCount.toLocaleString('vi-VN')}</p>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="relative space-y-4 pt-4">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className="flex items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-8 py-5 text-base font-extrabold text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Download className="h-6 w-6" />
            <span>TẢI PHẦN MỀM TRỰC TIẾP</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-8 text-center text-slate-500">
            Chưa cập nhật link tải. Vui lòng liên hệ Admin.
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Quay lại danh sách</span>
          </Link>
        </div>
      </div>
    </>
  );
}
