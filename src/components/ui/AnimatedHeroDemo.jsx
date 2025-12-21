import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  Brain,
  Presentation,
  Map,
  CheckCircle,
  Upload,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Palette,
  Download,
  Image,
  Printer,
  ListChecks,
  Network,
  Radio,
  FileQuestion,
  Layers,
  Settings,
  Crown,
  Mic,
} from "lucide-react";

const AnimatedHeroDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Features data with animations
  const features = [
    {
      id: 0,
      title: "توليد البحوث العلمية",
      subtitle: "بحوث متكاملة بصيغ PDF و Word",
      description: "مقدمة • فهرس • مصادر • مراجع",
      icon: FileText,
      color: "from-emerald-400 to-teal-500",
      content: (
        <div className="space-y-4">
          {/* Document Preview */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">عناصر البحث</span>
              <div className="flex gap-2">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "#a8e6cf" }}
                >
                  PDF
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "#c4b5fd" }}
                >
                  Word
                </span>
              </div>
            </div>
            {["مقدمة", "فهرس المحتوى", "المصادر والمراجع", "الخاتمة"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                  >
                    <CheckCircle size={16} className="text-green-500" />
                  </motion.div>
                  <span className="text-sm text-gray-600">{item}</span>
                </motion.div>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "تخصيص التصميم",
      subtitle: "الألوان والخطوط والأنساق",
      description: "تصدير ككتاب أو جاهز للطباعة",
      icon: Palette,
      color: "from-purple-400 to-pink-500",
      content: (
        <div className="space-y-4">
          {/* Color Picker */}
          <div className="flex justify-center gap-3 mb-4">
            {["#a8e6cf", "#c4b5fd", "#fdba74", "#fda4af", "#93c5fd"].map(
              (color, i) => (
                <motion.div
                  key={color}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="w-10 h-10 rounded-full cursor-pointer shadow-md"
                  style={{ background: color }}
                />
              )
            )}
          </div>
          {/* Font Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-4 shadow-sm text-center"
          >
            <div className="flex justify-center gap-4 mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                Cairo
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "#a8e6cf" }}
              >
                Almarai
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                Tajawal
              </span>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <Printer size={18} className="text-gray-400" />
              <Download size={18} className="text-gray-400" />
              <BookOpen size={18} className="text-gray-400" />
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      id: 2,
      title: "الدردشة مع الملفات",
      subtitle: "رفع PDF أو صور أو نصوص",
      description: "تلخيص • أسئلة • خرائط ذهنية",
      icon: MessageSquare,
      color: "from-blue-400 to-cyan-500",
      content: (
        <div className="space-y-3">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 border-2 border-dashed border-blue-200 text-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Upload size={32} className="mx-auto text-blue-400 mb-2" />
            </motion.div>
            <p className="text-sm text-gray-500">PDF • صور • نصوص</p>
          </motion.div>
          {/* Chat Bubbles */}
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-xl p-3 mr-8"
            >
              <p className="text-sm text-blue-700">لخص لي هذا الكتاب</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="bg-gray-50 rounded-xl p-3 ml-8"
            >
              <p className="text-sm text-gray-600">إليك ملخص شامل للكتاب...</p>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "حل الأسئلة الذكي",
      subtitle: "من صور أو ملفات أو نصوص",
      description: "شرح الخطوات • المصادر • القوانين",
      icon: HelpCircle,
      color: "from-orange-400 to-amber-500",
      content: (
        <div className="space-y-3">
          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Image size={16} className="text-orange-400" />
              <FileText size={16} className="text-orange-400" />
              <span className="text-xs text-gray-500">
                ارفع صورة أو ملف السؤال
              </span>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-orange-700">س: احسب مساحة المثلث...</p>
            </div>
          </motion.div>
          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-green-50 rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-sm font-semibold text-green-700">الحل</span>
            </div>
            <p className="text-xs text-green-600">
              المساحة = ½ × القاعدة × الارتفاع
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 4,
      title: "توليد الأسئلة",
      subtitle: "أنواع متعددة حسب الطلب",
      description: "اختيار من متعدد • صح وخطأ • مقالي",
      icon: ListChecks,
      color: "from-violet-400 to-purple-500",
      content: (
        <div className="space-y-3">
          {/* Question Types */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "اختيار", icon: "⭕" },
              { name: "صح/خطأ", icon: "✓✗" },
              { name: "مقالي", icon: "📝" },
              { name: "أكمل", icon: "___" },
              { name: "وصّل", icon: "↔️" },
              { name: "ارسم", icon: "✏️" },
            ].map((type, i) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-2 text-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <span className="text-lg">{type.icon}</span>
                <p className="text-xs text-gray-600 mt-1">{type.name}</p>
              </motion.div>
            ))}
          </div>
          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-3 mt-2"
          >
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "#a8e6cf" }}
            >
              مع نموذج الحل
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "#c4b5fd" }}
            >
              تصدير
            </span>
          </motion.div>
        </div>
      ),
    },
    {
      id: 5,
      title: "الخرائط الذهنية",
      subtitle: "من الملفات والصور والنصوص",
      description: "تفاعلية وقابلة للتصدير",
      icon: Network,
      color: "from-teal-400 to-emerald-500",
      content: (
        <div className="flex items-center justify-center py-4">
          {/* Mind Map Animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #a8e6cf, #93c5fd)",
              }}
            >
              <Brain size={28} className="text-white" />
            </motion.div>
            {/* Branches */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={angle}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="absolute w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                style={{
                  top: `${50 + Math.sin((angle * Math.PI) / 180) * 55}px`,
                  left: `${52 + Math.cos((angle * Math.PI) / 180) * 55}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: [
                      "#a8e6cf",
                      "#c4b5fd",
                      "#fdba74",
                      "#fda4af",
                      "#93c5fd",
                      "#fde047",
                    ][i],
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "العروض التقديمية",
      subtitle: "من صورة أو ملف أو نص",
      description: "شرائح احترافية جاهزة",
      icon: Presentation,
      color: "from-rose-400 to-pink-500",
      content: (
        <div className="space-y-3">
          {/* Slides Preview */}
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((slide, i) => (
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="w-20 h-14 rounded-lg shadow-md flex items-center justify-center text-sm font-bold"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg, #a8e6cf, #93c5fd)"
                      : i === 1
                      ? "linear-gradient(135deg, #c4b5fd, #fda4af)"
                      : "#f3f4f6",
                  color: i === 2 ? "#6b7280" : "white",
                }}
              >
                {slide}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">عرض تقديمي من 15 شريحة</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 7,
      title: "المطويات والإذاعات",
      subtitle: "تصميم وطباعة احترافية",
      description: "ألوان متعددة • جاهزة للطباعة",
      icon: Layers,
      color: "from-amber-400 to-orange-500",
      content: (
        <div className="flex items-center justify-center gap-4 py-4">
          {/* Brochure */}
          <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-28 rounded-lg shadow-lg flex flex-col overflow-hidden"
          >
            <div className="h-1/3" style={{ background: "#a8e6cf" }} />
            <div className="h-1/3" style={{ background: "#c4b5fd" }} />
            <div className="h-1/3" style={{ background: "#fdba74" }} />
          </motion.div>
          {/* Radio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-20 h-28 rounded-lg bg-gray-50 shadow-lg flex flex-col items-center justify-center gap-2"
          >
            <Radio size={24} className="text-orange-400" />
            <Mic size={20} className="text-amber-400" />
            <p className="text-xs text-gray-500">إذاعة</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 8,
      title: "خرائط المفاهيم",
      subtitle: "تنظيم الأفكار بصرياً",
      description: "تفاعلية وقابلة للتحرير",
      icon: Map,
      color: "from-cyan-400 to-blue-500",
      content: (
        <div className="flex items-center justify-center py-4">
          {/* Concept Map */}
          <div className="relative" style={{ width: "180px", height: "120px" }}>
            {/* Main Node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #93c5fd, #c4b5fd)",
              }}
            >
              <Map size={24} className="text-white" />
            </motion.div>
            {/* Child Nodes */}
            {[
              { x: 0, y: -50 },
              { x: 60, y: 0 },
              { x: 0, y: 50 },
              { x: -60, y: 0 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="absolute w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center"
                style={{
                  top: `calc(50% + ${pos.y}px)`,
                  left: `calc(50% + ${pos.x}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    background: ["#a8e6cf", "#fdba74", "#fda4af", "#c4b5fd"][i],
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "إدارة الباقات",
      subtitle: "نظام اشتراكات متكامل",
      description: "مجاني • بلس • برو",
      icon: Crown,
      color: "from-yellow-400 to-amber-500",
      content: (
        <div className="flex justify-center gap-3">
          {[
            { name: "مجاني", price: "0", color: "#a8e6cf" },
            { name: "بلس", price: "49", color: "#c4b5fd" },
            { name: "برو", price: "99", color: "#fdba74" },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-xl p-3 shadow-md text-center"
              style={{ minWidth: "70px" }}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: plan.color }}
              >
                {i === 2 && <Crown size={14} className="text-white" />}
                {i === 1 && <Sparkles size={14} className="text-white" />}
                {i === 0 && <CheckCircle size={14} className="text-white" />}
              </div>
              <p className="text-xs font-semibold">{plan.name}</p>
              <p className="text-xs text-gray-400">{plan.price} ر.س</p>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  // Auto-cycle through features
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, features.length]);

  const currentFeature = features[currentStep];

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Demo Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-400 text-center">
              app.alqtar.ai
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6" style={{ minHeight: "350px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {/* Feature Header */}
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center shadow-lg`}
                >
                  <currentFeature.icon size={28} className="text-white" />
                </motion.div>
                <div>
                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold text-gray-800"
                  >
                    {currentFeature.title}
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500"
                  >
                    {currentFeature.subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-gray-400 mt-0.5"
                  >
                    {currentFeature.description}
                  </motion.p>
                </div>
              </div>

              {/* Feature Content */}
              <div
                className="bg-gray-50 rounded-2xl p-5"
                style={{ minHeight: "200px" }}
              >
                {currentFeature.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Dots */}
        <div className="px-6 pb-4">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <motion.div
              key={currentStep}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${
                  currentFeature.color.includes("emerald")
                    ? "#34d399"
                    : currentFeature.color.includes("purple")
                    ? "#a78bfa"
                    : currentFeature.color.includes("blue")
                    ? "#60a5fa"
                    : currentFeature.color.includes("orange")
                    ? "#fb923c"
                    : currentFeature.color.includes("violet")
                    ? "#a78bfa"
                    : currentFeature.color.includes("teal")
                    ? "#2dd4bf"
                    : currentFeature.color.includes("rose")
                    ? "#fb7185"
                    : currentFeature.color.includes("amber")
                    ? "#fbbf24"
                    : currentFeature.color.includes("cyan")
                    ? "#22d3ee"
                    : currentFeature.color.includes("yellow")
                    ? "#facc15"
                    : "#a8e6cf"
                }, transparent)`,
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 flex-wrap">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-6 bg-accent-green"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                title={feature.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3"
      >
        <Sparkles size={24} className="text-accent-green" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3"
      >
        <Brain size={24} className="text-accent-purple" />
      </motion.div>
    </div>
  );
};

export default AnimatedHeroDemo;
