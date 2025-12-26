import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { signup, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("كلمتا المرور غير متطابقتين");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validatePassword()) return;

    setLoading(true);

    try {
      await signup(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
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

  const features = [
    "500 رصيد مجاني أسبوعياً",
    "إنشاء بحوث وعروض تقديمية",
    "حل الأسئلة وتوليدها",
    "الخرائط الذهنية",
    "تصدير PDF و Word",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-stone-100">
      {/* Left Side - Decoration (hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 top-20 left-20 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div
            className="absolute w-80 h-80 bottom-40 right-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-white max-w-md"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-8 shadow-2xl">
            <Sparkles size={48} />
          </div>
          <h2 className="text-4xl font-black mb-4">ابدأ رحلتك مع القطار</h2>
          <p className="text-xl mb-8 text-gray-300">
            انضم لآلاف المستخدمين الذين يحولون أفكارهم إلى محتوى احترافي
          </p>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <CheckCircle size={16} className="text-teal-400" />
                </div>
                <span className="text-gray-300 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12 overflow-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">ق</span>
            </div>
            <span className="text-xl font-bold text-gray-800">القطار</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600 mb-8">ابدأ رحلتك مع القطار مجاناً</p>

          {/* Error Message */}
          {(error || passwordError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200"
            >
              {error || passwordError}
            </motion.div>
          )}

          {/* Google Login */}
          <Button
            variant="secondary"
            className="w-full mb-6 cursor-pointer"
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
            <span>التسجيل بـ Google</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="الاسم الكامل"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أحمد محمد"
              icon={<User size={18} />}
              required
              disabled={loading || googleLoading}
            />

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
                helper="8 أحرف على الأقل"
                required
                disabled={loading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-12 text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="تأكيد كلمة المرور"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              required
              disabled={loading || googleLoading}
            />

            <label className="flex items-start gap-2 mb-8 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                required
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                أوافق على{" "}
                <Link
                  to="/terms"
                  className="text-teal-600 font-medium hover:underline"
                >
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link
                  to="/privacy"
                  className="text-teal-600 font-medium hover:underline"
                >
                  سياسة الخصوصية
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full mt-6 cursor-pointer"
              loading={loading}
              disabled={googleLoading}
              icon={<ArrowLeft size={18} />}
              iconPosition="end"
            >
              إنشاء الحساب
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            لديك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              سجّل دخولك
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
