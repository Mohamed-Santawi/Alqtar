import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Sparkles, Zap, Crown } from "lucide-react";
import { Header, Footer } from "../components/layout";
import Button from "../components/ui/Button";
import { Accordion, AccordionItem } from "../components/ui/Accordion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

      <main className="pt-24 pb-16 px-4 md:pt-30 md:pb-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-xl"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-700">
              أنشئ محتوى احترافي
              <br />
              <span className="gradient-text">أسرع بـ 10 مرات</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              اختر الخطة المناسبة لاحتياجاتك
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center mb-12 md:mb-15"
          >
            <div className="inline-flex items-center gap-4 p-2 rounded-full bg-gray-100 border border-gray-200">
              {/* Monthly Option */}
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 text-lg rounded-full font-medium transition-all duration-300 cursor-pointer ${
                  !isAnnual
                    ? "bg-white text-gray-800 shadow-md"
                    : "bg-transparent text-gray-500"
                }`}
              >
                شهري
              </button>

              {/* Annual Option */}
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 text-lg rounded-full font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isAnnual
                    ? "bg-white text-gray-800 shadow-md"
                    : "bg-transparent text-gray-500"
                }`}
              >
                سنوي
                {isAnnual && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-200 text-gray-800">
                    -25%
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 max-w-6xl mx-auto mt-12 md:mt-16 mb-16 md:mb-20">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.name;

              return (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className="block cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isSelected ? 1.05 : 1,
                    }}
                    whileHover={{
                      y: -8,
                      scale: isSelected ? 1.05 : 1.03,
                      transition: { duration: 0.3 },
                    }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                    className={`relative rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                      isSelected
                        ? "shadow-2xl border-4 border-green-500"
                        : plan.highlighted
                        ? "shadow-2xl border-2 border-green-300 hover:border-green-400 hover:shadow-3xl"
                        : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl"
                    }`}
                    style={
                      plan.highlighted
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(168, 230, 207, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)",
                          }
                        : {}
                    }
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                        <span className="font-bold text-sm px-4 py-1 rounded-full bg-green-200 text-gray-800">
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute -top-4 right-4 pointer-events-none">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 font-bold text-sm px-3 py-1 rounded-full bg-green-500 text-white"
                        >
                          <Check size={16} />
                          مُحدد
                        </motion.span>
                      </div>
                    )}

                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <plan.icon size={28} className="text-white" />
                    </motion.div>

                    {/* Name & Description */}
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-black text-gray-800">
                        {plan.price[isAnnual ? "annual" : "monthly"]}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-500"> ريال/شهر</span>
                      )}
                      {plan.price.monthly === 0 && (
                        <span className="text-gray-500"> مجاناً للأبد</span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to="/checkout"
                      state={{
                        plan: plan.name,
                        price: plan.price[isAnnual ? "annual" : "monthly"],
                        billing: isAnnual ? "annual" : "monthly",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="block mb-6"
                    >
                      <motion.button
                        className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-lg text-white shadow-lg relative overflow-hidden"
                        style={{
                          background: plan.highlighted
                            ? "linear-gradient(135deg, #1d7c59 0%, #4826c2ff 50%, #9b6328ff 100%)"
                            : "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Shine effect */}
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
                        <span className="relative z-10">{plan.cta}</span>
                        <ArrowLeft size={18} className="relative z-10" />
                      </motion.button>
                    </Link>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={18} className="text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-bg-secondary rounded-3xl p-xl mb-3xl"
          >
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              تبحث عن خطة مؤسسية؟
            </h3>
            <p className="text-gray-600 mb-6">
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
            <h2 className="text-3xl font-bold text-center mb-12 md:mb-16 text-gray-800">
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
