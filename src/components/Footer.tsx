import React from "react";
import Link from "next/link";
import { Download, ShieldCheck, Mail, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="T-TEAM Logo"
                className="h-8 w-8 rounded-lg object-contain bg-slate-900 border border-slate-800 p-0.5"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                T-TEAM<span className="text-violet-500">Share</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Nơi chia sẻ phần mềm, công cụ, hệ điều hành và trò chơi máy tính miễn phí, chất lượng cao và an toàn. Tất cả phần mềm đều được kiểm tra trước khi đăng tải.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Liên Kết</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/#categories-section" className="hover:text-white transition-colors">
                  Danh Mục Phần Mềm
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Điều Khoản & Hỗ Trợ</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Sạch & An Toàn</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-500">
                <Mail className="h-4 w-4 text-violet-400 shrink-0" />
                <span>businesswithtteamstudio@gmail.com</span>
              </li>
              <li className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tuyên bố miễn trừ trách nhiệm: Trang web này chỉ chia sẻ tài nguyên cho mục đích nghiên cứu và học tập. Chúng tôi không chịu trách nhiệm về bất kỳ bản quyền hay thiệt hại nào.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} T-TEAM Share. Built with Next.js 15 & TailwindCSS.</p>
          <p className="mt-4 md:mt-0">Design by T-TEAM</p>
        </div>
      </div>
    </footer>
  );
}
