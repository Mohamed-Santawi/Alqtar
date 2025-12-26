import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, ChevronDown, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

// Wavy underline SVG for active links (napkin-style)
const WavyUnderline = () => (
  <svg
    className="absolute bottom-0 left-0 right-0 w-full"
    height="6"
    viewBox="0 0 100 6"
    preserveAspectRatio="none"
    style={{ transform: "translateY(4px)" }}
  >
    <path
      d="M0,3 Q12.5,0 25,3 T50,3 T75,3 T100,3"
      fill="none"
      stroke="#A8E6CF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/pricing", label: "الأسعار" },
    { href: "/about", label: "من نحن" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${
          isScrolled ? "shadow-sm" : ""
        }`}
        style={{ height: "70px" }}
      >
        <div className="container h-full">
          <nav className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">ق</span>
              </div>
              <span className="text-lg font-bold" style={{ color: "#1f2937" }}>
                القطار
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative py-2 group"
                  >
                    <span
                      className={`transition-all duration-200 ${
                        isActive
                          ? "font-bold text-gray-800"
                          : "font-medium text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {link.label}
                    </span>
                    {/* Wavy underline for active link */}
                    {isActive && <WavyUnderline />}
                    {/* Hover underline animation */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden  md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center cursor-pointer gap-2 py-2 px-3 rounded-xl bg-gray-500 hover:bg-gray-800 transition-colors border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-purple flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.displayName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          "م"}
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-gray-600" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        {/* Invisible backdrop to close dropdown when clicking outside */}
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-40"
                        >
                          <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <p className="font-semibold truncate text-sm">
                              {user.displayName || "مستخدم"}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {user.email}
                            </p>
                          </div>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User size={18} className="text-blue-600" />
                            <span>لوحة التحكم</span>
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full cursor-pointer flex items-center gap-3 p-3 hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 border-t border-gray-100 text-sm font-medium"
                          >
                            <LogOut size={18} className="text-red-600" />
                            <span>تسجيل الخروج</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:text-gray-800 transition-colors py-2 px-3"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link to="/register">
                    <motion.button
                      className="group flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200"
                      style={{ padding: "10px 24px" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>ابدأ مجاناً</span>
                      <ArrowLeft size={16} />
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Only on Mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              style={{ top: "70px" }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-xl"
              style={{
                top: "70px",
                maxHeight: "calc(100vh - 70px)",
                overflowY: "auto",
              }}
            >
              <div className="container py-4">
                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-3 px-4 rounded-xl transition-colors ${
                          isActive
                            ? "bg-gradient-to-l from-accent-green/20 to-accent-blue/20 font-bold text-gray-800"
                            : "font-medium text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-4" />

                {/* Auth Actions */}
                <div className="space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-green to-accent-purple flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.displayName?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "م"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {user.displayName || "مستخدم"}
                          </p>
                          <p className="text-sm text-muted truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full">لوحة التحكم</Button>
                      </Link>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="secondary" className="w-full">
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          className="w-full"
                          icon={<ArrowLeft size={16} />}
                          iconPosition="end"
                        >
                          ابدأ مجاناً
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
