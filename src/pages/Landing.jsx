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
      style={{ paddingTop: "120px", paddingBottom: "60px" }}
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
            className="hero-title text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-lg"
            style={{ color: "#1f2937" }}
          >
            حوّل أفكارك إلى
            <br />
            <span className="gradient-text">محتوى بصري احترافي</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="hero-subtitle text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-xl px-md"
          >
            أنشئ البحوث العلمية، العروض التقديمية، الخرائط الذهنية، والأسئلة
            بضغطة زر واحدة باستخدام قوة الذكاء الاصطناعي
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="cta-buttons flex items-center justify-center gap-md"
            style={{ marginBottom: "60px" }}
          >
            <Link to="/register">
              <Button
                size="lg"
                icon={<ArrowLeft size={20} />}
                iconPosition="end"
              >
                ابدأ مجاناً
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="secondary" size="lg">
                اكتشف المميزات
              </Button>
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
    <section className="section bg-bg-secondary relative overflow-hidden">
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
          className="text-center mb-3xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #93c5fd 100%)",
            }}
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>
          <h2 className="section-title">كل ما تحتاجه في منصة واحدة</h2>
          <p className="section-subtitle">
            أدوات ذكية مدعومة بالذكاء الاصطناعي لتسهيل رحلتك التعليمية
          </p>
        </motion.div>

        {/* Features Grid with Stagger Animation */}
        <motion.div
          className="grid grid-4"
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
                className="h-full text-center p-xl rounded-3xl border border-gray-100 bg-white relative overflow-hidden group cursor-pointer"
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
                  className="relative z-10 mx-auto mb-lg"
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
                  <h3
                    className="text-xl font-bold mb-sm group-hover:text-gray-900 transition-colors"
                    style={{ color: "#1f2937" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-secondary group-hover:text-gray-600 transition-colors">
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
          className="text-center"
          style={{ marginTop: "80px" }}
        >
          <Link to="/features">
            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowLeft size={20} />}
              iconPosition="end"
            >
              استكشف جميع المميزات
            </Button>
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
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3xl"
        >
          <h2 className="section-title">كيف يعمل القطار؟</h2>
          <p className="section-subtitle">
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
                className="flex items-start gap-lg"
              >
                <div className="feature-number shrink-0">{step.number}</div>
                <div className="bg-white rounded-2xl p-lg border border-gray-100 flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <h3
                    className="text-xl font-bold mb-sm"
                    style={{ color: "#1f2937" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-secondary">{step.description}</p>
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
    <section className="section bg-primary text-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3xl"
        >
          <h2 className="section-title text-black">حالات الاستخدام</h2>
          <p className="section-subtitle text-gray-400">
            القطار مناسب للطلاب، المعلمين، الباحثين، وكل من يسعى للتميز
          </p>
        </motion.div>

        <motion.div
          className="grid grid-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {useCases.map((useCase, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-lg text-center hover:bg-white/20 transition-colors cursor-pointer">
                <div className="text-6xl mb-lg">{useCase.image}</div>
                <h3 className="text-xl font-bold mb-sm">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
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
    <section className="py-xl bg-gradient-to-r from-accent-green/10 via-accent-purple/10 to-accent-orange/10">
      <div className="container">
        <motion.div
          className="grid grid-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center">
              <div className="text-4xl md:text-5xl font-black gradient-text mb-sm">
                {stat.value}
              </div>
              <p className="text-secondary font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
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
  ];

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3xl"
        >
          <h2 className="section-title">ماذا يقول مستخدمونا</h2>
          <p className="section-subtitle">
            آلاف المستخدمين يثقون بالقطار لإنجاز أعمالهم
          </p>
        </motion.div>

        <motion.div
          className="grid grid-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full">
                {/* Rating */}
                <div className="flex gap-1 mb-lg">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-lg mb-lg leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-green to-accent-purple flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
    <section className="section bg-bg-secondary relative overflow-hidden">
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
          className="text-center mb-3xl"
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
            className="w-16 h-16 rounded-2xl mx-auto mb-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #c4b5fd 0%, #a8e6cf 100%)",
            }}
          >
            <HelpCircle size={32} className="text-white" />
          </motion.div>
          <h2 className="section-title">الأسئلة الشائعة</h2>
          <p className="section-subtitle">إجابات على الأسئلة الأكثر شيوعاً</p>
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

        {/* Bottom Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-3xl"
        >
          <p className="text-secondary mb-md">لم تجد إجابة لسؤالك؟</p>
          <Link to="/contact">
            <Button variant="secondary" icon={<MessageSquare size={18} />}>
              تواصل معنا
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-gray-900 text-white p-xl md:p-3xl text-center"
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="blob blob-green w-64 h-64 top-0 right-0 opacity-20" />
            <div className="blob blob-purple w-48 h-48 bottom-0 left-0 opacity-20" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-lg">
              جاهز لتحويل أفكارك؟
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-xl">
              انضم لآلاف المستخدمين الذين يستخدمون القطار لإنجاز أعمالهم بسرعة
              واحترافية
            </p>
            <Link to="/register">
              <Button
                variant="gradient"
                size="lg"
                icon={<ArrowLeft size={20} />}
                iconPosition="end"
              >
                ابدأ مجاناً الآن
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-lg">
              لا حاجة لبطاقة ائتمان • 500 رصيد مجاني
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
