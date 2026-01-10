import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Map,
  Presentation,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  Sparkles,
  Zap,
  FolderOpen,
  Crown,
  Users,
  BarChart3,
  Shield,
  Coins,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Admin navigation items
  const adminNavigation = [
    { name: "لوحة الإدارة", href: "/dashboard/admin", icon: Shield },
    { name: "إدارة المستخدمين", href: "/dashboard/admin/users", icon: Users },
    { name: "الإحصائيات", href: "/dashboard/admin/stats", icon: BarChart3 },
  ];

  const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "مشاريعي", href: "/dashboard/projects", icon: FolderOpen },
    {
      name: "الأدوات",
      icon: Sparkles,
      children: [
        { name: "البحث العلمي", href: "/dashboard/research", icon: FileText },
        {
          name: "الدردشة الذكية",
          href: "/dashboard/chat",
          icon: MessageSquare,
        },
        { name: "حل الأسئلة", href: "/dashboard/solve", icon: HelpCircle },
        { name: "توليد الأسئلة", href: "/dashboard/questions", icon: BookOpen },
        { name: "الخرائط الذهنية", href: "/dashboard/mindmap", icon: Map },
        {
          name: "العروض التقديمية",
          href: "/dashboard/presentation",
          icon: Presentation,
        },
        { name: "المطويات", href: "/dashboard/brochure", icon: Image },
      ],
    },
    { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
  ];

  // Add admin navigation if user is admin
  const fullNavigation = isAdmin
    ? [
        ...navigation.slice(0, 1),
        {
          name: "الإدارة",
          icon: Shield,
          children: adminNavigation,
        },
        ...navigation.slice(1),
      ]
    : navigation;

  const quickActions = [
    {
      title: "بحث علمي جديد",
      description: "أنشئ بحثاً علمياً متكاملاً",
      icon: FileText,
      color: "from-green-400 to-emerald-500",
      href: "/dashboard/research/new",
    },
    {
      title: "دردشة مع ملف",
      description: "ارفع ملفاً واسأل أي سؤال",
      icon: MessageSquare,
      color: "from-blue-400 to-cyan-500",
      href: "/dashboard/chat/new",
    },
    {
      title: "حل سؤال",
      description: "أرسل سؤالك واحصل على الحل",
      icon: HelpCircle,
      color: "from-purple-400 to-violet-500",
      href: "/dashboard/solve/new",
    },
    {
      title: "توليد أسئلة",
      description: "أنشئ أسئلة من محتواك",
      icon: BookOpen,
      color: "from-orange-400 to-amber-500",
      href: "/dashboard/questions/new",
    },
    {
      title: "خريطة ذهنية",
      description: "حوّل أفكارك لخريطة ذهنية",
      icon: Map,
      color: "from-pink-400 to-rose-500",
      href: "/dashboard/mindmap/new",
    },
    {
      title: "عرض تقديمي",
      description: "أنشئ عرضاً احترافياً",
      icon: Presentation,
      color: "from-teal-400 to-cyan-500",
      href: "/dashboard/presentation/new",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get icon color based on item type
  const getIconColor = (item, isActive) => {
    if (isActive) return "#10b981";
    if (item.name === "الإدارة" || item.name === "لوحة الإدارة")
      return "#f59e0b";
    return "#6b7280";
  };

  const NavItem = ({ item }) => {
    const [open, setOpen] = useState(false);
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isAdminSection =
      item.name === "الإدارة" || item.name?.includes("إدار");

    if (hasChildren) {
      return (
        <div style={{ marginBottom: "6px" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              background: open ? "#f3f4f6" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!open) e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              if (!open) e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isAdminSection
                    ? "rgba(245, 158, 11, 0.15)"
                    : "#e0f2fe",
                  flexShrink: 0,
                }}
              >
                <item.icon
                  size={20}
                  style={{ color: isAdminSection ? "#f59e0b" : "#0ea5e9" }}
                />
              </div>
              {sidebarOpen && (
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {item.name}
                </span>
              )}
            </div>
            {sidebarOpen && (
              <ChevronDown
                size={18}
                style={{
                  color: "#9ca3af",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            )}
          </button>
          {open && sidebarOpen && (
            <div
              style={{
                marginTop: "8px",
                marginRight: "20px",
                paddingRight: "16px",
                borderRight: "2px solid #e5e7eb",
              }}
            >
              {item.children.map((child) => (
                <NavItem key={child.href || child.name} item={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          marginBottom: "6px",
          borderRadius: "12px",
          textDecoration: "none",
          background: isActive
            ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
            : "transparent",
          borderRight: isActive ? "none" : "3px solid transparent",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "#f3f4f6";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6",
            flexShrink: 0,
          }}
        >
          <item.icon
            size={20}
            style={{
              color: isActive ? "#ffffff" : "#6b7280",
            }}
          />
        </div>
        {sidebarOpen && (
          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: isActive ? "#ffffff" : "#374151",
            }}
          >
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside
        className={`flex flex-col transition-all duration-300 fixed right-0 top-0 bottom-0 z-50 lg:z-40 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: sidebarOpen ? "min(320px, 85vw)" : "80px",
          maxWidth: "320px",
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
          borderLeft: "1px solid #e5e7eb",
          boxShadow: "-6px 0 30px rgba(0,0,0,0.06)",
        }}
      >
        {/* User Info Header (Replaces Logo) */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Hamburger icon in sidebar */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden w-10 h-10 rounded-lg text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            <X size={20} />
          </button>

          <div
            className="rounded-full flex items-center justify-center shrink-0"
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)",
            }}
          >
            <span className="text-white font-bold text-lg">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "م"}
            </span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden flex-1" style={{ minWidth: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <p
                  className="font-bold truncate"
                  style={{ color: "#1f2937", fontSize: "15px" }}
                >
                  {user?.displayName || "مستخدم"}
                </p>
                {isAdmin && (
                  <span
                    className="rounded-full text-xs font-bold shrink-0"
                    style={{
                      padding: "2px 6px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                      color: "#ffffff",
                    }}
                  >
                    مسؤول
                  </span>
                )}
              </div>
              <p
                className="truncate"
                style={{ color: "#6b7280", fontSize: "13px" }}
              >
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {/* Credits Card */}
        {sidebarOpen && (
          <div
            className="rounded-2xl"
            style={{
              marginTop: "16px",
              marginRight: "16px",
              marginLeft: "16px",
              padding: "18px",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "10px" }}
            >
              <span
                className="font-semibold"
                style={{ color: "#374151", fontSize: "14px" }}
              >
                الرصيد المتبقي
              </span>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Zap size={16} className="text-white" />
              </div>
            </div>
            <p
              className="font-black"
              style={{
                color: "#10b981",
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              {(
                userData?.balance ??
                userData?.subscription?.credits ??
                500
              ).toLocaleString()}
            </p>
            <div
              className="rounded-full overflow-hidden"
              style={{
                height: "8px",
                background: "rgba(16, 185, 129, 0.15)",
              }}
            >
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  height: "100%",
                  width: `${Math.min(
                    ((userData?.balance ??
                      userData?.subscription?.credits ??
                      500) /
                      (isAdmin ? 99999 : 500)) *
                      100,
                    100
                  )}%`,
                  background:
                    "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
                }}
              />
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{ padding: "20px 16px", minHeight: "0" }}
        >
          {/* Main Section */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              القائمة الرئيسية
            </h3>
            <div className="space-y-1">
              <NavItem
                item={{
                  name: "لوحة التحكم",
                  href: "/dashboard",
                  icon: LayoutDashboard,
                }}
              />

              {/* User Links */}
              {!isAdmin && (
                <>
                  <NavItem
                    item={{
                      name: "المشاريع",
                      href: "/dashboard/projects",
                      icon: FolderOpen,
                    }}
                  />
                  <NavItem
                    item={{
                      name: "النقاط",
                      href: "/dashboard/credits",
                      icon: Coins,
                    }}
                  />
                </>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <NavItem
                    item={{
                      name: "الاعضاء",
                      href: "/dashboard/admin/users",
                      icon: Users,
                    }}
                  />
                  <NavItem
                    item={{
                      name: "الطلبات",
                      href: "/dashboard/admin/requests",
                      icon: ClipboardList,
                    }}
                  />
                  <NavItem
                    item={{
                      name: "المدفوعات",
                      href: "/dashboard/admin/payments",
                      icon: CreditCard,
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Tools Section - Always visible */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              الأدوات والخدمات
            </h3>
            <div className="space-y-1">
              <NavItem
                item={{
                  name: "البحث العلمي",
                  href: "/dashboard/research",
                  icon: FileText,
                }}
              />
              <NavItem
                item={{
                  name: "الدردشة الذكية",
                  href: "/dashboard/chat",
                  icon: MessageSquare,
                }}
              />
              <NavItem
                item={{
                  name: "حل الأسئلة",
                  href: "/dashboard/solve",
                  icon: HelpCircle,
                }}
              />
              <NavItem
                item={{
                  name: "توليد الأسئلة",
                  href: "/dashboard/questions",
                  icon: BookOpen,
                }}
              />
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              النظام
            </h3>
            <div className="space-y-1">
              <NavItem
                item={{
                  name: "الإعدادات",
                  href: "/dashboard/settings",
                  icon: Settings,
                }}
              />
              <NavItem
                item={{
                  name: "خطة اسعاري",
                  href: "/pricing",
                  icon: CreditCard,
                }}
              />
              <NavItem
                item={{
                  name: "العودة للصفحة الرئيسية",
                  href: "/",
                  icon: LayoutDashboard, // Or Home icon if available
                }}
              />
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div style={{ padding: "20px 16px", borderTop: "1px solid #f0f0f0" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full rounded-xl transition-all duration-300"
            style={{ padding: "14px 16px", cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <LogOut size={18} style={{ color: "#ef4444" }} />
            </div>
            {sidebarOpen && (
              <span
                className="font-semibold"
                style={{ color: "#ef4444", fontSize: "15px" }}
              >
                تسجيل الخروج
              </span>
            )}
          </button>
        </div>

        {/* Toggle Button - Hidden on mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute top-6 -left-3 w-7 h-7 rounded-full items-center justify-center transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
            cursor: "pointer",
          }}
        >
          <ChevronDown
            size={14}
            className="text-white"
            style={{
              transform: sidebarOpen ? "rotate(90deg)" : "rotate(-90deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 min-h-screen overflow-auto transition-all duration-300 w-full"
        style={{
          marginRight: "0",
          padding: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <style>{`
          @media (min-width: 640px) {
            main {
              padding: 24px 32px !important;
            }
          }
          @media (min-width: 1024px) {
            main {
              margin-right: ${sidebarOpen ? "320px" : "80px"} !important;
              padding: 32px 40px !important;
            }
          }
          @media (min-width: 1280px) {
            main {
              padding: 40px 50px !important;
            }
          }
        `}</style>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {/* Hamburger icon in main content */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-lg text-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Menu size={20} />
              </button>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-black"
                style={{ color: "#1e293b" }}
              >
                مرحباً، {user?.displayName?.split(" ")[0] || "مستخدم"} 👋
              </h1>
            </div>
            {isAdmin && (
              <span
                className="px-4 py-1.5 text-sm font-bold rounded-full flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                }}
              >
                <Shield size={14} />
                مسؤول
              </span>
            )}
          </div>
          <p
            style={{ color: "#64748b" }}
            className="text-sm sm:text-base lg:text-lg"
          >
            {isAdmin
              ? "مرحباً بك في لوحة تحكم المسؤول"
              : "ماذا تريد أن تنشئ اليوم؟"}
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "40px" }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1e293b" }}>
            الإجراءات السريعة
          </h2>
          <div
            className="grid gap-4 sm:gap-5 md:gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link to={action.href}>
                  <div
                    className="h-full rounded-2xl transition-all duration-300 cursor-pointer group"
                    style={{
                      padding: "20px",
                      background: "#ffffff",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid #f1f5f9",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.04)";
                    }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      style={{
                        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                        marginBottom: "20px",
                      }}
                    >
                      <action.icon size={26} className="text-white" />
                    </div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#1e293b" }}
                    >
                      {action.title}
                    </h3>
                    <p style={{ color: "#64748b" }}>{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admin Analytics Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "40px" }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1e293b" }}>
              نظرة عامة على الإحصائيات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Users Stats */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "#64748b" }}>المستخدمين</span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#eff6ff" }}
                  >
                    <Users size={20} style={{ color: "#3b82f6" }} />
                  </div>
                </div>
                <h3
                  className="text-2xl font-black mb-1"
                  style={{ color: "#1e293b" }}
                >
                  1,234
                </h3>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  +12% زيادة
                </p>
              </div>

              {/* Requests Stats */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "#64748b" }}>الطلبات الجديدة</span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#fef3c7" }}
                  >
                    <ClipboardList size={20} style={{ color: "#f59e0b" }} />
                  </div>
                </div>
                <h3
                  className="text-2xl font-black mb-1"
                  style={{ color: "#1e293b" }}
                >
                  45
                </h3>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  +5 اليوم
                </p>
              </div>

              {/* Revenue Stats */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "#64748b" }}>الإيرادات</span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#d1fae5" }}
                  >
                    <CreditCard size={20} style={{ color: "#10b981" }} />
                  </div>
                </div>
                <h3
                  className="text-2xl font-black mb-1"
                  style={{ color: "#1e293b" }}
                >
                  $12,500
                </h3>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  +8% هذا الشهر
                </p>
              </div>

              {/* Active Projects */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "#64748b" }}>المشاريع النشطة</span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#f3e8ff" }}
                  >
                    <LayoutDashboard size={20} style={{ color: "#8b5cf6" }} />
                  </div>
                </div>
                <h3
                  className="text-2xl font-black mb-1"
                  style={{ color: "#1e293b" }}
                >
                  856
                </h3>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  +24% نشاط
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
          // style={{ marginTop: "40px", marginBottom: "40px" }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1e293b" }}>
            {isAdmin ? "آخر العمليات" : "المشاريع الأخيرة"}
          </h2>
          <div
            className="p-10 rounded-2xl text-center"
            style={{
              background: "#ffffff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              border: "1px solid #f1f5f9",
              padding: "20px",
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              }}
            >
              {isAdmin ? (
                <ClipboardList size={36} style={{ color: "#94a3b8" }} />
              ) : (
                <FolderOpen size={36} style={{ color: "#94a3b8" }} />
              )}
            </div>
            <h3
              className="font-bold text-lg mb-2 mt-2"
              style={{ color: "#1e293b", marginTop: "20px" }}
            >
              {isAdmin ? "لا توجد عمليات حديثة" : "لا توجد مشاريع بعد"}
            </h3>
            <p className="mb-5" style={{ color: "#64748b" }}>
              {isAdmin
                ? "ستظهر العمليات الجديدة هنا"
                : "ابدأ بإنشاء مشروعك الأول"}
            </p>
            {!isAdmin && (
              <button
                className="px-6 py-6 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  cursor: "pointer",
                  padding: "10px 20px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Plus size={18} />
                مشروع جديد
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
