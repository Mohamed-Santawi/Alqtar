import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <span className="text-white font-bold text-xl">ق</span>
            </div>
            <span className="text-xl font-bold">القطار</span>
          </Link>

          <h1 className="text-3xl font-bold mb-sm">مرحباً بعودتك!</h1>
          <p className="text-secondary mb-xl">سجّل دخولك للوصول إلى حسابك</p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-md rounded-xl mb-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Google Login */}
          <Button
            variant="secondary"
            className="w-full mb-lg"
            onClick={handleGoogleLogin}
            loading={googleLoading}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>تسجيل الدخول بـ Google</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-md mb-lg">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-muted">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              icon={<Mail size={18} />}
              required
              disabled={loading || googleLoading}
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
                disabled={loading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-10 text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between mb-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-accent-green hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={googleLoading}
              icon={<ArrowLeft size={18} />}
              iconPosition="end"
            >
              تسجيل الدخول
            </Button>
          </form>

          <p className="text-center text-secondary mt-xl">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: "#0d9488" }}
            >
              أنشئ حساباً جديداً
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decoration (hidden on mobile) */}
      <div
        className="auth-decoration flex-1 bg-gradient-to-br from-primary via-primary to-gray-900 items-center justify-center p-xl relative overflow-hidden"
        style={{ display: "none" }}
      >
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="blob blob-green w-96 h-96 top-20 right-20 opacity-20" />
          <div className="blob blob-purple w-80 h-80 bottom-40 left-20 opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center text-white"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center mx-auto mb-lg">
            <Sparkles size={48} />
          </div>
          <h2 className="text-4xl font-black mb-md">القطار</h2>
          <p className="text-xl max-w-md" style={{ color: "#e5e7eb" }}>
            حوّل أفكارك إلى محتوى بصري احترافي بقوة الذكاء الاصطناعي
          </p>
        </motion.div>
      </div>
    </div>
  );
}
