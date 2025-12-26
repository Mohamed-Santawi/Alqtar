import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "../components/layout";
import Button from "../components/ui/Button";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price, billing } = location.state || {
    plan: "مجاني",
    price: 0,
    billing: "monthly",
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const isFree = price === 0;

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to dashboard after successful checkout
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="pt-24 pb-16 px-4 md:pt-30 md:pb-20">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-gray-700">
              إتمام الاشتراك
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              أنت على بعد خطوة واحدة من البدء
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <Sparkles size={20} className="text-green-500" />
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">الخطة</span>
                    <span className="font-bold text-gray-800">{plan}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">نوع الفوترة</span>
                    <span className="font-bold text-gray-800">
                      {billing === "annual" ? "سنوي" : "شهري"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">السعر</span>
                    <span className="text-2xl font-black text-gray-800">
                      {price} ريال
                      {!isFree && (
                        <span className="text-sm text-gray-500">
                          /{billing === "annual" ? "سنة" : "شهر"}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {isFree && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6"
                  >
                    <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      خطة مجانية بدون أي تكلفة
                    </p>
                  </motion.div>
                )}

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-6 pt-6 border-t border-gray-100">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span>دفع آمن ومشفر 100%</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
                {isFree ? (
                  // Free Plan Confirmation
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check size={40} className="text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                      الخطة المجانية جاهزة!
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      يمكنك البدء مباشرة في استخدام القطار مع 500 رصيد مجاني
                      أسبوعياً
                    </p>

                    <motion.button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-3 mx-auto px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg relative overflow-hidden cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(135deg, #1d7c59 0%, #4826c2ff 50%, #9b6328ff 100%)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isProcessing
                        ? "جاري التحميل..."
                        : "الذهاب إلى لوحة التحكم"}
                      <ArrowLeft size={20} />
                    </motion.button>
                  </div>
                ) : (
                  // Paid Plan Payment Form
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <CreditCard size={24} className="text-gray-700" />
                      معلومات الدفع
                    </h2>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckout();
                      }}
                    >
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم البطاقة
                        </label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            تاريخ الانتهاء
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>

                        {/* CVV */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                            maxLength="3"
                          />
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم حامل البطاقة
                        </label>
                        <input
                          type="text"
                          placeholder="الاسم كما يظهر على البطاقة"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Security Notice */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <Lock
                          size={20}
                          className="text-blue-500 flex-shrink-0 mt-0.5"
                        />
                        <p className="text-sm text-gray-700">
                          معلوماتك محمية بتشفير SSL 256-bit. نحن لا نخزن معلومات
                          بطاقتك الائتمانية.
                        </p>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg relative overflow-hidden cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, #1d7c59 0%, #4826c2ff 50%, #9b6328ff 100%)",
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing
                          ? "جاري المعالجة..."
                          : `دفع ${price} ريال`}
                        <Lock size={20} />
                      </motion.button>
                    </form>
                  </div>
                )}

                {/* Back Link */}
                <div className="mt-8 text-center">
                  <Link
                    to="/pricing"
                    className="text-gray-600 hover:text-gray-800 font-medium inline-flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={16} className="rotate-180" />
                    العودة إلى الخطط
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
