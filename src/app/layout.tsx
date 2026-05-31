import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ShareActive Hub - Tải Phần Mềm Full Version, Link Google Drive & Mega",
  description: "Trang web chia sẻ phần mềm, hệ điều hành, công cụ và game PC chất lượng cao hoàn toàn miễn phí. Link tải trực tiếp Google Drive, OneDrive, Mega tốc độ cao.",
  keywords: ["tải phần mềm", "phần mềm crack", "download software", "filecr", "getintopc", "adobe full version", "autocad link google drive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-[#3899D3]/30 selection:text-white">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
