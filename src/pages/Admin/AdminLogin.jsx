import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// Admin email constant - must match the one in AuthContext
const ADMIN_EMAIL = "admin@alqtar.com";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Check if email is admin email
    if (email !== ADMIN_EMAIL) {
      setLocalError("هذه الصفحة مخصصة للمسؤولين فقط");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-lg"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Admin Card */}
        <div className="bg-white rounded-3xl p-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl mx-auto mb-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
              }}
            >
              <Shield size={40} className="text-white" />
            </motion.div>
            <h1
              className="text-2xl font-bold mb-sm"
              style={{ color: "#1f2937" }}
            >
              لوحة تحكم المسؤول
            </h1>
            <p style={{ color: "#6b7280" }}>
              سجّل دخولك للوصول إلى لوحة الإدارة
            </p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 text-red-600 p-md rounded-xl mb-lg"
            >
              <AlertCircle size={18} />
              <span>{localError || error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alqtar.com"
              icon={<Mail size={18} />}
              required
              disabled={loading}
            />

            <div className="relative">
              <Input
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-10 text-muted hover:text-primary transition-colors"
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-lg"
              loading={loading}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
              }}
            >
              <Shield size={18} />
              <span>تسجيل دخول المسؤول</span>
            </Button>
          </form>

          {/* Back Link */}
          <p className="text-center mt-lg" style={{ color: "#6b7280" }}>
            <a
              href="/"
              className="hover:underline"
              style={{ color: "#0d9488" }}
            >
              العودة للصفحة الرئيسية
            </a>
          </p>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-lg text-sm"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          © 2024 القطار. جميع الحقوق محفوظة.
        </p>
      </motion.div>
    </div>
  );
}
