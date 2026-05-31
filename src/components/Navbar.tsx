"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, LayoutDashboard, Menu, X, Layers, Home } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Trang Chủ", icon: Home },
    { href: "/#categories-section", label: "Danh Mục", icon: Layers },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false; // Anchor link
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3899D3] to-blue-600 shadow-lg shadow-[#3899D3]/20">
                <Download className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                ShareActive<span className="text-[#3899D3]">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-[#3899D3]/10 text-[#3899D3] border border-[#3899D3]/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium transition-all ${
                  active
                    ? "bg-[#3899D3]/10 text-[#3899D3] border border-[#3899D3]/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
