"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Category, Software } from "@/types";
import { saveToGitHub } from "@/lib/github";
import CategoryIcon from "@/components/CategoryIcon";
import {
  Lock,
  LayoutDashboard,
  Layers,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Save,
  LogOut,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
  Database,
  ArrowLeft,
  X,
  Upload,
  HardDrive,
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"software" | "categories" | "settings">("software");

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // GitHub integration settings
  const [gitToken, setGitToken] = useState("");
  const [gitOwner, setGitOwner] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [isLocalMode, setIsLocalMode] = useState(true);

  // Search
  const [swSearch, setSwSearch] = useState("");

  // Modals state
  const [showSwModal, setShowSwModal] = useState(false);
  const [editingSw, setEditingSw] = useState<Software | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form States
  // Software Form
  const [swForm, setSwForm] = useState<{
    id: string;
    name: string;
    categoryId: string;
    logo: string;
    size: string;
    downloadUrl: string;
  }>({
    id: "",
    name: "",
    categoryId: "",
    logo: "",
    size: "",
    downloadUrl: "",
  });

  // Category Form
  const [catForm, setCatForm] = useState<Category>({
    id: "",
    name: "",
    icon: "Layers",
    description: "",
  });

  // Load initial settings and check login
  useEffect(() => {
    // Check if logged in in session
    const logged = sessionStorage.getItem("admin_logged") === "true";
    if (logged) {
      setIsLoggedIn(true);
    }

    // Load GitHub configurations from localStorage
    const savedToken = localStorage.getItem("git_token") || "";
    const savedOwner = localStorage.getItem("git_owner") || "";
    const savedRepo = localStorage.getItem("git_repo") || "";
    const savedBranch = localStorage.getItem("git_branch") || "main";
    const savedMode = localStorage.getItem("git_mode") !== "github"; // default to local mode

    setGitToken(savedToken);
    setGitOwner(savedOwner);
    setGitRepo(savedRepo);
    setGitBranch(savedBranch);
    setIsLocalMode(savedMode);

    // Fetch initial JSON files from public directory
    const loadData = async () => {
      try {
        const [resCat, resSw] = await Promise.all([
          fetch("/data/categories.json?t=" + Date.now()),
          fetch("/data/software.json?t=" + Date.now()),
        ]);

        if (resCat.ok && resSw.ok) {
          const cats = await resCat.json();
          const sws = await resSw.json();
          setCategories(cats);
          setSoftware(sws);
        } else {
          showNotification("error", "Không thể tải dữ liệu JSON từ public/data/");
        }
      } catch (error) {
        console.error(error);
        showNotification("error", "Lỗi nạp dữ liệu. Hãy tạo file JSON trước.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password verification. Default is '"Boy0779147435-/@@"'
    if (password === "Boy0779147435-/@@") {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged", "true");
      setAuthError("");
    } else {
      setAuthError("Bro Có Quyền À BRUHH");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged");
  };

  // Save configurations
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("git_token", gitToken);
    localStorage.setItem("git_owner", gitOwner);
    localStorage.setItem("git_repo", gitRepo);
    localStorage.setItem("git_branch", gitBranch);
    localStorage.setItem("git_mode", isLocalMode ? "local" : "github");

    showNotification("success", "Đã lưu cài đặt cấu hình!");
  };

  // Filter Software List
  const filteredSw = useMemo(() => {
    return software.filter((sw) => {
      const matchSearch =
        sw.name.toLowerCase().includes(swSearch.toLowerCase()) ||
        sw.id.toLowerCase().includes(swSearch.toLowerCase());
      return matchSearch;
    });
  }, [software, swSearch]);

  // Handle Save (writes data locally or to Github depending on config)
  const saveAllData = async (
    type: "software" | "categories",
    updatedData: Software[] | Category[]
  ) => {
    setLoading(true);
    try {
      if (isLocalMode) {
        // Save locally in dev mode
        const res = await fetch("/api/admin/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, data: updatedData }),
        });

        const result = await res.json();
        if (res.ok) {
          showNotification("success", `Lưu dữ liệu local thành công! (${type}.json)`);
        } else {
          throw new Error(result.error || "Failed to save locally");
        }
      } else {
        // Save to GitHub
        if (!gitToken || !gitOwner || !gitRepo) {
          throw new Error("Vui lòng cấu hình token và thông tin repository GitHub trước.");
        }

        const path = `public/data/${type}.json`;
        await saveToGitHub(
          {
            token: gitToken,
            owner: gitOwner,
            repo: gitRepo,
            branch: gitBranch,
          },
          path,
          updatedData,
          `admin(dashboard): cập nhật danh sách ${type}`
        );

        showNotification("success", `Đã commit và push file ${type}.json lên GitHub thành công!`);
      }
      return true;
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", `Lỗi lưu: ${msg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete Software
  const handleDeleteSw = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phần mềm này? Action này không thể hoàn tác.")) return;
    const updated = software.filter((s) => s.id !== id);
    setSoftware(updated);
    await saveAllData("software", updated);
  };

  // Delete Category
  const handleDeleteCat = async (id: string) => {
    // Check if there are software items in this category
    const count = software.filter((sw) => sw.categoryId === id).length;
    if (count > 0) {
      alert(`Không thể xóa danh mục này vì đang có ${count} sản phẩm thuộc danh mục. Vui lòng chuyển hoặc xóa sản phẩm trước.`);
      return;
    }
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    await saveAllData("categories", updated);
  };

  // Open Software Modal
  const openSwModal = (sw: Software | null = null) => {
    if (sw) {
      setEditingSw(sw);
      setSwForm({
        id: sw.id,
        name: sw.name,
        categoryId: sw.categoryId,
        logo: sw.logo,
        size: sw.size,
        downloadUrl: sw.downloadUrl || "",
      });
    } else {
      setEditingSw(null);
      setSwForm({
        id: "",
        name: "",
        categoryId: categories[0]?.id || "",
        logo: "",
        size: "",
        downloadUrl: "",
      });
    }
    setShowSwModal(true);
  };

  // Save Software Form
  const handleSwFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swForm.id.trim() || !swForm.name.trim() || !swForm.categoryId) {
      showNotification("error", "Vui lòng nhập đầy đủ: Tên, Slug và Danh mục.");
      return;
    }

    const newSw: Software = {
      id: swForm.id.trim(),
      name: swForm.name.trim(),
      categoryId: swForm.categoryId,
      logo: swForm.logo.trim(),
      size: swForm.size.trim(),
      downloadUrl: swForm.downloadUrl.trim(),
      downloadsCount: editingSw ? editingSw.downloadsCount : 0,
      createdAt: editingSw ? editingSw.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedSoftware: Software[];
    if (editingSw) {
      // Edit
      updatedSoftware = software.map((s) => (s.id === editingSw.id ? newSw : s));
    } else {
      // Add
      if (software.some((s) => s.id === newSw.id)) {
        showNotification("error", "Slug phần mềm này đã tồn tại! Vui lòng chọn slug khác.");
        return;
      }
      updatedSoftware = [newSw, ...software];
    }

    setSoftware(updatedSoftware);
    const success = await saveAllData("software", updatedSoftware);
    if (success) {
      setShowSwModal(false);
    }
  };

  // Open Category Modal
  const openCatModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ ...cat });
    } else {
      setEditingCat(null);
      setCatForm({
        id: "",
        name: "",
        icon: "Layers",
        description: "",
      });
    }
    setShowCatModal(true);
  };

  // Save Category Form
  const handleCatFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.id.trim() || !catForm.name.trim()) {
      showNotification("error", "Vui lòng nhập Tên và Slug danh mục.");
      return;
    }

    const newCat: Category = {
      id: catForm.id.trim(),
      name: catForm.name.trim(),
      icon: catForm.icon.trim(),
      description: catForm.description.trim(),
    };

    let updatedCategories: Category[];
    if (editingCat) {
      // Edit
      updatedCategories = categories.map((c) => (c.id === editingCat.id ? newCat : c));
    } else {
      // Add
      if (categories.some((c) => c.id === newCat.id)) {
        showNotification("error", "Slug danh mục này đã tồn tại!");
        return;
      }
      updatedCategories = [...categories, newCat];
    }

    setCategories(updatedCategories);
    const success = await saveAllData("categories", updatedCategories);
    if (success) {
      setShowCatModal(false);
    }
  };

  // Backup Export Option: downloads the JSON file straight from the browser
  const handleExportJSON = (type: "software" | "categories") => {
    const data = type === "software" ? software : categories;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("success", `Đã xuất và tải về file ${type}.json!`);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-grow items-center justify-center px-4 py-24 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(56,153,211,0.08),rgba(255,255,255,0))]" />

        <div className="relative w-full max-w-md rounded-2xl border border-slate-900 bg-slate-900/30 p-8 backdrop-blur shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#3899D3]/10 border border-[#3899D3]/30">
              <Lock className="h-6 w-6 text-[#3899D3]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Quản Trị Viên</h1>
            <p className="text-sm text-slate-500">
              Nhập mật khẩu để truy cập vào hệ thống dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 focus:border-[#3899D3]/50 focus:outline-none focus:ring-1 focus:ring-[#3899D3]/50 text-sm transition-all"
              />
            </div>

            {authError && (
              <div className="flex items-center space-x-2 rounded-xl bg-red-950/30 border border-red-900/50 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#3899D3] hover:bg-sky-400 py-3 text-sm font-bold text-white transition-all shadow-lg hover:shadow-[#3899D3]/20"
            >
              Đăng Nhập
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#3899D3] hover:underline space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Quay lại Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#020617] text-slate-100 flex flex-col relative">
      {/* Top Banner / Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center space-x-2 rounded-xl px-4 py-3.5 shadow-xl border text-sm transition-all duration-300 animate-slide-in ${notification.type === "success"
            ? "bg-slate-900 border-emerald-800 text-emerald-400"
            : "bg-slate-900 border-red-800 text-red-400"
            }`}
        >
          {notification.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Shell Header */}
      <div className="border-b border-slate-900 bg-slate-950/60 backdrop-blur py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3899D3] to-indigo-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Quản Trị Hệ Thống</h1>
              <p className="text-xs text-slate-500">
                Thêm, sửa, xóa phần mềm, danh mục và quản lý triển khai trực tiếp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold border ${isLocalMode
                ? "bg-slate-900 border-blue-900/50 text-blue-400"
                : "bg-slate-900 border-purple-900/50 text-purple-400"
                }`}
            >
              Chế độ: {isLocalMode ? "Local File API" : "GitHub Deployer"}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-400 px-3 py-1.5 text-xs text-slate-400 transition-all font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 flex-grow">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("software")}
            className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${activeTab === "software"
              ? "bg-[#3899D3]/10 border-[#3899D3]/20 text-[#3899D3]"
              : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
          >
            <Download className="h-4 w-4" />
            <span>Quản Lý Phần Mềm</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${activeTab === "categories"
              ? "bg-[#3899D3]/10 border-[#3899D3]/20 text-[#3899D3]"
              : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
          >
            <Layers className="h-4 w-4" />
            <span>Quản Lý Danh Mục</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${activeTab === "settings"
              ? "bg-[#3899D3]/10 border-[#3899D3]/20 text-[#3899D3]"
              : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
          >
            <Settings className="h-4 w-4" />
            <span>Cài Đặt Đồng Bộ (Vercel)</span>
          </button>

          <div className="pt-6 border-t border-slate-900 space-y-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4">Sao lưu nhanh (JSON)</p>
            <button
              onClick={() => handleExportJSON("software")}
              className="w-full flex items-center justify-between rounded-xl hover:bg-slate-900 px-4 py-2 text-xs text-slate-400 hover:text-white font-medium"
            >
              <span className="flex items-center space-x-2">
                <Database className="h-3.5 w-3.5" />
                <span>Xuất software.json</span>
              </span>
              <Save className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleExportJSON("categories")}
              className="w-full flex items-center justify-between rounded-xl hover:bg-slate-900 px-4 py-2 text-xs text-slate-400 hover:text-white font-medium"
            >
              <span className="flex items-center space-x-2">
                <Database className="h-3.5 w-3.5" />
                <span>Xuất categories.json</span>
              </span>
              <Save className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>

        {/* Content Console Panel */}
        <main className="flex-grow bg-slate-900/10 border border-slate-900 rounded-2xl p-6 relative min-h-[500px]">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-40 rounded-2xl">
              <div className="flex flex-col items-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-[#3899D3]" />
                <span className="text-xs text-slate-400 font-semibold">Đang cập nhật hoặc đồng bộ...</span>
              </div>
            </div>
          )}

          {/* TAB 1: SOFTWARE MANAGER */}
          {activeTab === "software" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhanh phần mềm..."
                    value={swSearch}
                    onChange={(e) => setSwSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-850 bg-slate-950 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:border-[#3899D3]/40 focus:outline-none focus:ring-1 focus:ring-[#3899D3]/40 transition-all"
                  />
                </div>
                <button
                  onClick={() => openSwModal()}
                  className="flex items-center space-x-2 rounded-xl bg-[#3899D3] hover:bg-sky-400 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg shadow-[#3899D3]/15 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm phần mềm</span>
                </button>
              </div>

              {filteredSw.length > 0 ? (
                <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/30">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/70 text-slate-400 font-medium">
                        <th className="p-4">Phần mềm</th>
                        <th className="p-4 hidden sm:table-cell">Danh mục</th>
                        <th className="p-4">Dung lượng</th>
                        <th className="p-4 hidden md:table-cell">Lượt tải</th>
                        <th className="p-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {filteredSw.map((sw) => (
                        <tr key={sw.id} className="hover:bg-slate-900/20 text-slate-200 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={sw.logo || "/favicon.ico"}
                              alt={sw.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=36&q=80";
                              }}
                              className="h-8 w-8 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold block truncate">{sw.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono truncate block">{sw.id}</span>
                            </div>
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className="rounded bg-[#3899D3]/10 px-2 py-0.5 text-xs text-[#3899D3] font-medium">
                              {categories.find((c) => c.id === sw.categoryId)?.name || sw.categoryId}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold text-slate-350">{sw.size}</span>
                          </td>
                          <td className="p-4 hidden md:table-cell text-slate-400">
                            {sw.downloadsCount.toLocaleString('vi-VN')}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openSwModal(sw)}
                              className="rounded-lg border border-slate-850 bg-slate-900/40 p-2 text-slate-400 hover:text-white hover:border-[#3899D3]/40 transition-all inline-flex"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSw(sw.id)}
                              className="rounded-lg border border-slate-850 bg-slate-900/40 p-2 text-slate-400 hover:text-red-400 hover:border-red-950 transition-all inline-flex"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center">
                  <AlertCircle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Chưa có phần mềm nào hoặc tìm kiếm không khớp.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORY MANAGER */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h2 className="text-lg font-bold text-white">Quản Lý Danh Mục Phần Mềm</h2>
                <button
                  onClick={() => openCatModal()}
                  className="flex items-center space-x-2 rounded-xl bg-[#3899D3] hover:bg-sky-400 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg shadow-[#3899D3]/15"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm danh mục</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-start justify-between rounded-xl border border-slate-850 bg-slate-950/20 p-5 hover:bg-slate-950/40 transition-all"
                  >
                    <div className="flex items-start space-x-4 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                        <CategoryIcon name={cat.icon} className="h-5 w-5 text-[#3899D3]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white truncate">{cat.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{cat.id}</p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 shrink-0 ml-4">
                      <button
                        onClick={() => openCatModal(cat)}
                        className="rounded-lg border border-slate-850 bg-slate-900/40 p-2 text-slate-400 hover:text-white hover:border-[#3899D3]/40 transition-all inline-flex"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCat(cat.id)}
                        className="rounded-lg border border-slate-850 bg-slate-900/40 p-2 text-slate-400 hover:text-red-400 hover:border-red-950 transition-all inline-flex"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS / SYNC CONFIG */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="text-lg font-bold text-white">Triển Khai & Đồng Bộ (GitHub API)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đồng bộ dữ liệu của bạn trực tiếp lên GitHub repository để Vercel tự động build lại Static Site mà không cần database.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Save Mode */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Chế Độ Lưu Dữ Liệu</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsLocalMode(true)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${isLocalMode
                        ? "bg-blue-950/20 border-[#3899D3] text-[#3899D3]"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:bg-slate-900"
                        }`}
                    >
                      <Database className="h-6 w-6 mb-2" />
                      <span className="font-bold text-sm text-white">Chế độ Local API</span>
                      <span className="text-[10px] text-slate-500 mt-1">Lưu trực tiếp vào public/data/ (Chỉ hoạt động ở localhost)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLocalMode(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${!isLocalMode
                        ? "bg-purple-950/20 border-purple-500 text-purple-400"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:bg-slate-900"
                        }`}
                    >
                      <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span className="font-bold text-sm text-white">Chế độ GitHub API</span>
                      <span className="text-[10px] text-slate-500 mt-1">Commit lên GitHub Repo để Vercel tự động deploy lại (Khuyên dùng khi chạy Vercel)</span>
                    </button>
                  </div>
                </div>

                {!isLocalMode && (
                  <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                      <Settings className="h-4 w-4" />
                      <span>CẤU HÌNH GITHUB REPOSITORY</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">GitHub Owner (Tên tài khoản)</label>
                        <input
                          type="text"
                          placeholder="ví dụ: ductr"
                          value={gitOwner}
                          onChange={(e) => setGitOwner(e.target.value)}
                          className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-700 focus:border-[#3899D3]/40 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">GitHub Repo Name (Tên dự án)</label>
                        <input
                          type="text"
                          placeholder="ví dụ: share-active"
                          value={gitRepo}
                          onChange={(e) => setGitRepo(e.target.value)}
                          className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-700 focus:border-[#3899D3]/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Repository Branch (Nhánh chính)</label>
                        <input
                          type="text"
                          placeholder="main"
                          value={gitBranch}
                          onChange={(e) => setGitBranch(e.target.value)}
                          className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-700 focus:border-[#3899D3]/40 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Personal Access Token (PAT)</label>
                        <input
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx"
                          value={gitToken}
                          onChange={(e) => setGitToken(e.target.value)}
                          className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-700 focus:border-[#3899D3]/40 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-xl bg-[#3899D3] hover:bg-sky-400 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu cấu hình</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD/EDIT SOFTWARE */}
      {showSwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-900 bg-[#0a0f1d] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSwModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingSw ? `Chỉnh sửa phần mềm: ${editingSw.name}` : "Thêm phần mềm mới"}
              </h2>
              <p className="text-xs text-slate-500">Cập nhật toàn bộ thông tin chi tiết và link download.</p>
            </div>

            <form onSubmit={handleSwFormSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Tên phần mềm *</label>
                  <input
                    type="text"
                    required
                    value={swForm.name}
                    onChange={(e) => setSwForm({ ...swForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                    placeholder="ví dụ: Adobe Photoshop 2024"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Slug ID (Dùng làm URL) *</label>
                  <input
                    type="text"
                    required
                    disabled={editingSw !== null}
                    value={swForm.id}
                    onChange={(e) => setSwForm({ ...swForm, id: e.target.value })}
                    className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 disabled:opacity-50 focus:outline-none"
                    placeholder="ví dụ: adobe-photoshop-2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Danh mục *</label>
                  <select
                    value={swForm.categoryId}
                    onChange={(e) => setSwForm({ ...swForm, categoryId: e.target.value })}
                    className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Dung lượng *</label>
                  <input
                    type="text"
                    required
                    value={swForm.size}
                    onChange={(e) => setSwForm({ ...swForm, size: e.target.value })}
                    className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                    placeholder="ví dụ: 4.2 GB"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">URL Link Ảnh Logo *</label>
                  <input
                    type="text"
                    required
                    value={swForm.logo}
                    onChange={(e) => setSwForm({ ...swForm, logo: e.target.value })}
                    className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                    placeholder="https://example.com/logo.svg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Link Tải Xuống Phần Mềm *</label>
                <input
                  type="text"
                  required
                  value={swForm.downloadUrl}
                  onChange={(e) => setSwForm({ ...swForm, downloadUrl: e.target.value })}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none"
                  placeholder="https://link-tai-phan-mem..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowSwModal(false)}
                  className="rounded-xl border border-slate-880 bg-transparent hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-400 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 rounded-xl bg-[#3899D3] hover:bg-sky-400 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-[#3899D3]/15"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingSw ? "Cập nhật" : "Lưu lại"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-900 bg-[#0a0f1d] p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setShowCatModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-900 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingCat ? `Sửa danh mục: ${editingCat.name}` : "Thêm danh mục mới"}
              </h2>
              <p className="text-xs text-slate-500">Thiết lập ID, tên hiển thị và Icon tương ứng.</p>
            </div>

            <form onSubmit={handleCatFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="ví dụ: Adobe Products"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Slug ID (URL) *</label>
                <input
                  type="text"
                  required
                  disabled={editingCat !== null}
                  value={catForm.id}
                  onChange={(e) => setCatForm({ ...catForm, id: e.target.value })}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white disabled:opacity-50 focus:outline-none"
                  placeholder="ví dụ: adobe-products"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Lucide Icon Name (e.g. Code, Palette, Laptop) *</label>
                <input
                  type="text"
                  required
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="Palette"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="Mô tả tóm tắt nội dung danh mục..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="rounded-xl border border-slate-800 bg-transparent hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-400 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 rounded-xl bg-[#3899D3] hover:bg-sky-400 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingCat ? "Cập nhật" : "Lưu lại"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
