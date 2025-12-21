import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Sparkles, Zap, Crown } from "lucide-react";
import { Header, Footer } from "../components/layout";
import Button from "../components/ui/Button";
import { Accordion, AccordionItem } from "../components/ui/Accordion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "مجاني",
      description: "للمستخدمين الجدد والاستخدام الخفيف",
      price: { monthly: 0, annual: 0 },
      icon: Sparkles,
      color: "from-gray-400 to-gray-500",
      features: [
        "500 رصيد أسبوعياً",
        "تعديل غير محدود",
        "رفع ملفات PDF و Word",
        "تصدير PNG و PDF",
        "الأنماط الأساسية",
        "علامة القطار المائية",
      ],
      cta: "ابدأ مجاناً",
      highlighted: false,
    },
    {
      name: "بلس",
      description: "للمستخدمين النشطين",
      price: { monthly: 49, annual: 39 },
      icon: Zap,
      color: "from-accent-green to-accent-blue",
      features: [
        "10,000 رصيد شهرياً",
        "كل مميزات المجاني",
        "تصدير PPT و SVG",
        "3 أنماط مخصصة",
        "أيقونات متقدمة",
        "إزالة العلامة المائية",
        "إدارة الفريق",
      ],
      cta: "ابدأ الآن",
      highlighted: true,
      badge: "الأكثر شعبية",
    },
    {
      name: "برو",
      description: "للمحترفين والفرق",
      price: { monthly: 99, annual: 79 },
      icon: Crown,
      color: "from-accent-purple to-accent-pink",
      features: [
        "30,000 رصيد شهرياً",
        "كل مميزات بلس",
        "تصاميم حصرية",
        "أنماط مخصصة غير محدودة",
        "رفع خطوط مخصصة",
        "إدارة الفريق المتقدمة",
        "شراء رصيد إضافي",
        "دعم أولوية",
      ],
      cta: "ابدأ الآن",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "ما هو الرصيد؟",
      answer:
        "الرصيد هو وحدة قياس الاستخدام. يتم استهلاك رصيد واحد تقريباً لكل كلمة يتم توليدها. قد يختلف الاستهلاك للمخرجات المعقدة.",
    },
    {
      question: "هل يوجد خصم للاشتراك السنوي؟",
      answer: "نعم! توفر الخطط السنوية خصماً بنسبة 25% مقارنة بالخطط الشهرية.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer:
        "نقبل جميع بطاقات الائتمان الرئيسية، PayPal، ومدى. كما ندعم Apple Pay و Google Pay.",
    },
    {
      question: "هل يمكنني إلغاء اشتراكي؟",
      answer:
        "نعم، يمكنك إلغاء اشتراكك في أي وقت. ستحتفظ بالوصول للمميزات حتى نهاية فترة الفوترة.",
    },
    {
      question: "ماذا يحدث عند نفاد الرصيد؟",
      answer:
        "يمكنك الترقية لخطة أعلى أو شراء رصيد إضافي. في الخطة المجانية، يتجدد الرصيد أسبوعياً.",
    },
    {
      question: "هل توجد خصومات للطلاب؟",
      answer:
        "الخطة المجانية مصممة لتناسب معظم احتياجات الطلاب. للاحتياجات الأكبر، تواصل معنا.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-xl"
          >
            <h1
              className="text-4xl md:text-5xl font-black mb-md"
              style={{ color: "#1f2937" }}
            >
              أنشئ محتوى احترافي
              <br />
              <span className="gradient-text">أسرع بـ 10 مرات</span>
            </h1>
            <p className="text-xl" style={{ color: "#4b5563" }}>
              اختر الخطة المناسبة لاحتياجاتك
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
            style={{ marginBottom: "60px" }}
          >
            <div
              className="inline-flex items-center gap-4 p-2 rounded-full"
              style={{
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Monthly Option */}
              <button
                onClick={() => setIsAnnual(false)}
                className="px-6 py-2 rounded-full font-medium transition-all duration-300"
                style={{
                  backgroundColor: !isAnnual ? "#ffffff" : "transparent",
                  color: !isAnnual ? "#1f2937" : "#6b7280",
                  boxShadow: !isAnnual ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                }}
              >
                شهري
              </button>

              {/* Annual Option */}
              <button
                onClick={() => setIsAnnual(true)}
                className="px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                style={{
                  backgroundColor: isAnnual ? "#ffffff" : "transparent",
                  color: isAnnual ? "#1f2937" : "#6b7280",
                  boxShadow: isAnnual ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                }}
              >
                سنوي
                {isAnnual && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#a8e6cf", color: "#1f2937" }}
                  >
                    -25%
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div
            className="grid grid-3 max-w-5xl mx-auto mt-6xl"
            style={{ marginBottom: "80px" }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`relative rounded-3xl p-lg ${
                  plan.highlighted
                    ? "shadow-2xl scale-105 border-2"
                    : "bg-white border border-gray-200"
                }`}
                style={
                  plan.highlighted
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(168, 230, 207, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)",
                        borderColor: "#a8e6cf",
                      }
                    : {}
                }
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="font-bold text-sm px-4 py-1 rounded-full"
                      style={{ backgroundColor: "#a8e6cf", color: "#1f2937" }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-lg`}
                >
                  <plan.icon size={28} className="text-white" />
                </div>

                {/* Name & Description */}
                <h3
                  className="text-2xl font-bold mb-sm"
                  style={{ color: "#1f2937" }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "24px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-lg">
                  <span
                    className="text-4xl font-black"
                    style={{ color: "#1f2937" }}
                  >
                    {plan.price[isAnnual ? "annual" : "monthly"]}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span style={{ color: "#6b7280" }}> ريال/شهر</span>
                  )}
                  {plan.price.monthly === 0 && (
                    <span style={{ color: "#6b7280" }}> مجاناً للأبد</span>
                  )}
                </div>

                {/* CTA */}
                <Link to="/register" className="block mb-lg">
                  <Button
                    variant={plan.highlighted ? "gradient" : "primary"}
                    className="w-full"
                    icon={<ArrowLeft size={18} />}
                    iconPosition="end"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={18} style={{ color: "#22c55e" }} />
                      <span style={{ color: "#4b5563" }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-bg-secondary rounded-3xl p-xl mb-3xl"
          >
            <h3
              className="text-2xl font-bold mb-sm"
              style={{ color: "#1f2937" }}
            >
              تبحث عن خطة مؤسسية؟
            </h3>
            <p className="text-secondary mb-lg">
              للمؤسسات الكبيرة والاحتياجات المخصصة، تواصل مع فريق المبيعات
            </p>
            <Button variant="secondary">تواصل معنا</Button>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2
              className="text-3xl font-bold text-center mb-xl"
              style={{ color: "#1f2937" }}
            >
              الأسئلة الشائعة
            </h2>
            <Accordion>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
