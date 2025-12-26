import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Brain,
  MessageSquare,
  HelpCircle,
  Map,
  Presentation,
  BookOpen,
  Image,
  Download,
  ArrowLeft,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { Header, Footer } from "../components/layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Accordion, AccordionItem } from "../components/ui/Accordion";
import AnimatedHeroDemo from "../components/ui/AnimatedHeroDemo";

// Animation variants - SLOW for elegant scroll reveal
const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier
    },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "100px", paddingBottom: "40px" }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob blob-green w-96 h-96 top-20 right-20 opacity-30" />
        <div className="blob blob-purple w-80 h-80 bottom-40 left-20 opacity-20" />
        <div className="blob blob-orange w-64 h-64 top-1/2 left-1/3 opacity-20" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl text-gray-700 sm:text-5xl md:text-6xl font-black leading-tight mb-6"

          >
            حوّل أفكارك إلى
            <br />
            <span className="bg-gradient-to-r from-[#1d7c59] via-[#5a3dbe] to-[#b37a3d] bg-clip-text text-transparent">
              محتوى بصري احترافي
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 px-4"
          >
            أنشئ البحوث العلمية، العروض التقديمية، الخرائط الذهنية، والأسئلة
            بضغطة زر واحدة باستخدام قوة الذكاء الاصطناعي
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="cta-buttons mt-10 mb-10 md:flex-row flex flex-col flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register">
              <motion.button
                className="flex items-center cursor-pointer gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ابدأ مجاناً</span>
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <Link to="/features">
              <motion.button
                className="flex items-center cursor-pointer gap-3 px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all"
                style={{
                  borderColor: "#1f2937",
                  color: "#1f2937",
                  backgroundColor: "white",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>اكتشف المميزات</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="trust-indicators mt-xl flex flex-wrap items-center justify-center gap-md sm:gap-lg text-muted text-sm"
          >
            <span className="flex items-center gap-1">
              <CheckCircle size={16} className="text-green-500" />
              بدون بطاقة ائتمان
            </span>
            <span className="flex items-center gap-1">
              <Shield size={16} className="text-green-500" />
              آمن 100%
            </span>
            <span className="flex items-center gap-1">
              <Zap size={16} className="text-green-500" />
              500 رصيد مجاني
            </span>
          </motion.div>
        </motion.div>

        {/* Hero Animated Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-3xl hero-demo"
        >
          <AnimatedHeroDemo />
        </motion.div>
      </div>
    </section>
  );
}

// Features Section - Enhanced with Animations
function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "توليد البحوث العلمية",
      description:
        "أنشئ بحوثاً علمية متكاملة بصيغ PDF وWord مع خيارات تخصيص الألوان والخطوط",
      color: "from-emerald-400 to-teal-500",
      bgColor: "rgba(167, 243, 208, 0.15)",
      iconBg: "#a8e6cf",
    },
    {
      icon: MessageSquare,
      title: "دردشة مع الملفات",
      description:
        "ارفع ملفاتك واسأل أي سؤال، واحصل على إجابات ذكية وتلخيصات شاملة",
      color: "from-blue-400 to-cyan-500",
      bgColor: "rgba(147, 197, 253, 0.15)",
      iconBg: "#93c5fd",
    },
    {
      icon: HelpCircle,
      title: "حل الأسئلة",
      description:
        "أرسل سؤالك كصورة أو نص واحصل على حل تفصيلي مع شرح الخطوات والمصادر",
      color: "from-purple-400 to-violet-500",
      bgColor: "rgba(196, 181, 253, 0.15)",
      iconBg: "#c4b5fd",
    },
    {
      icon: BookOpen,
      title: "توليد الأسئلة",
      description:
        "أنشئ أسئلة متنوعة من محتواك مع نماذج الإجابة وخيارات التصدير",
      color: "from-orange-400 to-amber-500",
      bgColor: "rgba(253, 186, 116, 0.15)",
      iconBg: "#fdba74",
    },
    {
      icon: Map,
      title: "الخرائط الذهنية",
      description:
        "حوّل أي محتوى إلى خرائط ذهنية تفاعلية وخرائط مفاهيم احترافية",
      color: "from-pink-400 to-rose-500",
      bgColor: "rgba(253, 164, 175, 0.15)",
      iconBg: "#fda4af",
    },
    {
      icon: Presentation,
      title: "العروض التقديمية",
      description: "أنشئ عروضاً تقديمية احترافية من نصوصك أو ملفاتك بضغطة زر",
      color: "from-teal-400 to-cyan-500",
      bgColor: "rgba(45, 212, 191, 0.15)",
      iconBg: "#2dd4bf",
    },
    {
      icon: Image,
      title: "المطويات والإذاعات",
      description:
        "صمم مطويات جاهزة للطباعة وإذاعات مدرسية بأشكال وألوان متنوعة",
      color: "from-indigo-400 to-blue-500",
      bgColor: "rgba(129, 140, 248, 0.15)",
      iconBg: "#818cf8",
    },
    {
      icon: Download,
      title: "تصدير متعدد",
      description:
        "صدّر أعمالك بصيغ PDF وWord وPPT وSVG جاهزة للطباعة والمشاركة",
      color: "from-red-400 to-pink-500",
      bgColor: "rgba(251, 113, 133, 0.15)",
      iconBg: "#fb7185",
    },
  ];

  // Animation variants for scroll reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-8 px-4 md:px-0 bg-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #a8e6cf 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #fdba74 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container relative z-10">
        {/* Section Header with Scroll Animation */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #93c5fd 100%)",
            }}
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-700 font-extrabold leading-tight mb-4">
            كل ما تحتاجه في منصة واحدة
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            أدوات ذكية مدعومة بالذكاء الاصطناعي لتسهيل رحلتك التعليمية
          </p>
        </motion.div>

        {/* Features Grid with Stagger Animation */}
        <motion.div
          className="grid px-4 md:px-12 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className="h-full text-center p-8 rounded-3xl border border-gray-100 bg-white relative overflow-hidden group cursor-pointer"
                style={{
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.4s ease",
                }}
              >
                {/* Hover Background Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: feature.bgColor }}
                />

                {/* Animated Icon Container */}
                <motion.div
                  className="relative z-10 mx-auto mb-8"
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mx-auto relative`}
                  >
                    {/* Animated Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ border: `2px solid ${feature.iconBg}` }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <feature.icon
                      size={32}
                      className="text-white relative z-10"
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl mb-4 font-bold mb-sm group-hover:text-gray-900 transition-colors text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-500 font-meduim transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
                  style={{
                    background: `linear-gradient(90deg, ${feature.iconBg}, transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12 md:mt-20 mb-12 md:mb-20"
        >
          <Link to="/features">
            <motion.button
              className="flex mx-auto cursor-pointer items-center justify-center gap-3 cursor-pointer font-bold text-lg md:text-xl text-white shadow-lg rounded-xl relative overflow-hidden px-8 py-4 md:px-10 md:py-5"
              style={{
                background:
                  "linear-gradient(135deg, #1d7c59 0%, #4826c2ff 50%, #9b6328ff 100%)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(93, 61, 190, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />

              <span className="relative z-10">استكشف جميع المميزات</span>

              {/* Animated icon */}
              <motion.div
                className="relative z-10"
                animate={{
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowLeft size={22} />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "اكتب أو ارفع محتواك",
      description:
        "ابدأ بكتابة النص أو رفع ملف PDF أو صورة. القطار يقبل جميع أنواع المحتوى.",
    },
    {
      number: "2",
      title: "اختر نوع المخرج",
      description:
        "حدد ما تريد إنشاءه: بحث علمي، خريطة ذهنية، عرض تقديمي، أو أسئلة.",
    },
    {
      number: "3",
      title: "خصّص وعدّل",
      description:
        "عدّل الألوان، الخطوط، والتنسيقات حسب رغبتك للحصول على نتيجة مثالية.",
    },
    {
      number: "4",
      title: "صدّر وشارك",
      description:
        "حمّل عملك بصيغة PDF أو Word أو PPT، جاهز للطباعة أو المشاركة.",
    },
  ];

  return (
    <section className="py-8 px-4 md:py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-700">
            كيف يعمل القطار؟
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            أربع خطوات بسيطة لتحويل أفكارك إلى محتوى احترافي
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-0 right-8 bottom-0 w-0.5 bg-gradient-to-b from-accent-green via-accent-purple to-accent-orange hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #36a079ff 0%, #4177b4ff 100%)",
                    boxShadow: "0 4px 15px rgba(168, 230, 207, 0.4)",
                  }}
                >
                  {step.number}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-2 text-gray-700">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 font-medium text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Use Cases Section
function UseCasesSection() {
  const useCases = [
    {
      title: "البحوث الأكاديمية",
      description: "أنشئ بحوثاً علمية متكاملة مع مقدمة وفهرس ومراجع",
      image: "📚",
    },
    {
      title: "العروض التقديمية",
      description: "حوّل أفكارك إلى شرائح عرض احترافية",
      image: "📊",
    },
    {
      title: "الدراسة والمراجعة",
      description: "أنشئ أسئلة اختبارية وتدرب عليها",
      image: "📝",
    },
    {
      title: "التلخيص والفهم",
      description: "لخّص الكتب والملفات الطويلة بسهولة",
      image: "📖",
    },
  ];

  return (
    <section className="py-8 px-4 md:py-12 md:px-10 bg-gradient-to-r from-white via-gray-50 to-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-700">
            حالات الاستخدام
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            القطار مناسب للطلاب، المعلمين، الباحثين، وكل من يسعى للتميز
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                <motion.div
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {useCase.image}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-gray-700">
                  {useCase.title}
                </h3>
                <p className="text-gray-500 font-medium">
                  {useCase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: "+10,000", label: "مستخدم نشط" },
    { value: "+50,000", label: "بحث تم إنشاؤه" },
    { value: "+100,000", label: "سؤال تم حله" },
    { value: "99%", label: "رضا العملاء" },
  ];

  return (
    <section className="py-8 px-4 md:py-12 md:px-10 bg-gradient-to-r from-white via-gray-50 to-white">
      <div className="container">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center"
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="bg-white rounded-2xl py-8 px-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div
                  className="text-4xl md:text-5xl font-black mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #167451ff 0%, #492cb1ff 50%, #8d5c27ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <p className="text-gray-700 font-bold text-base">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "طالب جامعي",
      avatar: "أ",
      content:
        "القطار وفّر علي ساعات طويلة في إعداد البحوث. الآن أستطيع التركيز على الفهم بدلاً من التنسيق.",
      rating: 5,
    },
    {
      name: "سارة العلي",
      role: "معلمة",
      avatar: "س",
      content:
        "أستخدم القطار لإنشاء أوراق العمل والأسئلة لطلابي. النتائج مذهلة وتوفر الكثير من الوقت.",
      rating: 5,
    },
    {
      name: "خالد الرشيد",
      role: "باحث أكاديمي",
      avatar: "خ",
      content:
        "أداة رائعة للباحثين. تساعدني في تنظيم أفكاري وإنشاء خرائط ذهنية احترافية.",
      rating: 5,
    },
    {
      name: "نورة السالم",
      role: "طالبة ثانوية",
      avatar: "ن",
      content:
        "ساعدني القطار في الاستعداد للاختبارات بإنشاء أسئلة تدريبية من ملخصاتي. أصبحت دراستي أكثر فعالية.",
      rating: 5,
    },
    {
      name: "محمد الشمري",
      role: "طبيب",
      avatar: "م",
      content:
        "استخدم القطار لإنشاء عروض تقديمية طبية للمؤتمرات. الجودة احترافية والوقت المستغرق قليل جداً.",
      rating: 5,
    },
    {
      name: "فاطمة حسن",
      role: "صانعة محتوى",
      avatar: "ف",
      content:
        "القطار غيّر طريقة عملي تماماً. أستطيع الآن إنتاج محتوى تعليمي بجودة عالية في وقت قياسي.",
      rating: 5,
    },
  ];

  // Auto-advance carousel every 4 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-8 px-4 md:py-12 md:px-10 bg-gradient-to-r from-white via-gray-50 to-white overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-700">
            ماذا يقول مستخدمونا
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            آلاف المستخدمين يثقون بالقطار لإنجاز أعمالهم
          </p>
        </motion.div>

        {/* Carousel - Shows 1 large card at a time */}
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-xl mb-8 leading-relaxed text-gray-600 font-medium text-center">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #167451ff 0%, #492cb1ff 100%)",
                  }}
                >
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700 text-lg">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-base text-gray-500">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="transition-all duration-300"
                style={{
                  width: currentIndex === index ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    currentIndex === index
                      ? "linear-gradient(135deg, #167451ff 0%, #492cb1ff 100%)"
                      : "#d1d5db",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section - Enhanced with Animations
function FAQSection() {
  const faqs = [
    {
      question: "هل القطار مجاني؟",
      answer:
        "نعم، نوفر خطة مجانية تتضمن 500 رصيد أسبوعياً. يمكنك الترقية للخطط المدفوعة للحصول على مميزات إضافية ورصيد أكبر.",
    },
    {
      question: "ما هي أنواع الملفات المدعومة؟",
      answer:
        "ندعم ملفات PDF وWord وصور (PNG, JPG) ونصوص. يمكنك رفع ملفاتك مباشرة أو نسخ ولصق النص.",
    },
    {
      question: "هل بياناتي آمنة؟",
      answer:
        "نعم، نستخدم تشفيراً متقدماً لحماية بياناتك. لا نشارك معلوماتك مع أي طرف ثالث ولا نستخدمها لتدريب نماذج الذكاء الاصطناعي.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer:
        "نقبل الدفع عبر بطاقات الائتمان، PayPal، ومدى. كما ندعم Apple Pay وGoogle Pay.",
    },
    {
      question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
      answer:
        "نعم، يمكنك إلغاء اشتراكك في أي وقت. ستحتفظ بالوصول إلى المميزات المدفوعة حتى نهاية فترة الفوترة الحالية.",
    },
    {
      question: "هل يوجد دعم فني؟",
      answer:
        "نعم، فريق الدعم متاح على مدار الساعة عبر الدردشة المباشرة أو البريد الإلكتروني.",
    },
  ];

  // Slower animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-8 px-4 md:py-12 md:px-10 bg-gradient-to-r from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-72 h-72 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #a8e6cf 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container relative z-10">
        {/* Section Header with Slower Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.3,
            }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #167451ff 0%, #492cb1ff 100%)",
            }}
          >
            <HelpCircle size={32} className="text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-700">
            الأسئلة الشائعة
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            إجابات على الأسئلة الأكثر شيوعاً
          </p>
        </motion.div>

        {/* FAQ Items with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto"
        >
          <Accordion>
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem title={faq.question}>{faq.answer}</AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-8 px-4 md:py-12 md:px-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl text-white p-8 md:p-12 lg:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, #167451ff 0%, #492cb1ff 50%, #8d5c27ff 100%)",
          }}
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-96 h-96 rounded-full top-0 right-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-80 h-80 rounded-full bottom-0 left-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              جاهز لتحويل أفكارك؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium"
            >
              انضم لآلاف المستخدمين الذين يستخدمون القطار لإنجاز أعمالهم بسرعة
              واحترافية
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/register">
                <motion.button
                  className="flex items-center mx-auto justify-center gap-3 cursor-pointer font-bold text-lg md:text-xl text-gray-800 shadow-xl rounded-xl relative overflow-hidden px-8 py-4 md:px-12 md:py-5"
                  style={{
                    background: "white",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background:
                      "linear-gradient(135deg, #167451ff 0%, #492cb1ff 50%, #8d5c27ff 100%)",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />

                  <span className="relative z-10">ابدأ مجاناً الآن</span>

                  {/* Animated icon */}
                  <motion.div
                    className="relative z-10"
                    animate={{
                      x: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowLeft size={24} />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
