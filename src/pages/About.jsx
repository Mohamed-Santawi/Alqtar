import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Target,
  Users,
  Heart,
  Zap,
  BookOpen,
  Brain,
} from "lucide-react";
import { Header, Footer } from "../components/layout";
import Button from "../components/ui/Button";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export default function About() {
  const team = [
    {
      name: "أحمد محمد",
      role: "المؤسس والرئيس التنفيذي",
      avatar: "أ",
      color: "from-accent-green to-accent-blue",
    },
    {
      name: "سارة العلي",
      role: "مديرة المنتج",
      avatar: "س",
      color: "from-accent-purple to-accent-pink",
    },
    {
      name: "خالد الرشيد",
      role: "مدير التقنية",
      avatar: "خ",
      color: "from-accent-orange to-accent-pink",
    },
    {
      name: "نورة السعيد",
      role: "مصممة تجربة المستخدم",
      avatar: "ن",
      color: "from-accent-blue to-accent-purple",
    },
    {
      name: "محمد العمري",
      role: "مهندس الذكاء الاصطناعي",
      avatar: "م",
      color: "from-accent-green to-accent-yellow",
    },
    {
      name: "فاطمة الحربي",
      role: "مديرة التسويق",
      avatar: "ف",
      color: "from-accent-pink to-accent-purple",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "شغف بالتعليم",
      description: "نؤمن بأن التعليم حق للجميع ونسعى لجعله متاحاً وممتعاً",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: Zap,
      title: "الابتكار المستمر",
      description: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول إبداعية",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Users,
      title: "مجتمع داعم",
      description: "نبني مجتمعاً يتشارك المعرفة ويدعم بعضه البعض",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Target,
      title: "التميز في الجودة",
      description: "نسعى دائماً لتقديم أفضل جودة ممكنة في كل ما نقدمه",
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main style={{ paddingTop: "120px" }}>
        {/* Hero Section */}
        <section className="section relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, #a8e6cf 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-3xl mx-auto mb-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #a8e6cf 0%, #93c5fd 100%)",
                }}
              >
                <Sparkles size={40} className="text-white" />
              </motion.div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-lg leading-tight"
                style={{ color: "#1f2937" }}
              >
                من نحن
              </h1>

              <p
                className="text-xl md:text-2xl leading-relaxed"
                style={{ color: "#4b5563" }}
              >
                نحن فريق شغوف بتحويل التعليم وجعله أكثر متعة وفعالية
                <br />
                باستخدام قوة الذكاء الاصطناعي
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-xl bg-bg-secondary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div
                className="text-3xl md:text-4xl font-bold mb-lg leading-relaxed"
                style={{ color: "#1f2937" }}
              >
                "الصورة الرائعة تلتقط جوهر الفكرة حقاً"
              </div>
              <p style={{ color: "#6b7280" }}>— فريق القطار</p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-2 items-center" style={{ gap: "60px" }}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mb-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #a8e6cf 0%, #93c5fd 100%)",
                  }}
                >
                  <BookOpen size={32} className="text-white" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-lg"
                  style={{ color: "#1f2937" }}
                >
                  قصتنا
                </h2>
                <div className="space-y-4" style={{ color: "#4b5563" }}>
                  <p className="text-lg leading-relaxed">
                    بدأت رحلتنا منذ سنوات عندما لاحظنا التحديات التي يواجهها
                    الطلاب والمعلمون في إنشاء المحتوى التعليمي. كانت العملية
                    مرهقة وتستهلك وقتاً طويلاً.
                  </p>
                  <p className="text-lg leading-relaxed">
                    أدركنا أن الذكاء الاصطناعي يمكن أن يحدث ثورة في طريقة إنشاء
                    المحتوى التعليمي. فقررنا بناء منصة تجمع بين سهولة الاستخدام
                    وقوة التقنية.
                  </p>
                  <p className="text-lg leading-relaxed">
                    اليوم، يستخدم آلاف المستخدمين منصة القطار لإنشاء البحوث
                    والعروض التقديمية والخرائط الذهنية بسهولة وسرعة غير مسبوقة.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div
                  className="rounded-3xl p-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168, 230, 207, 0.2) 0%, rgba(147, 197, 253, 0.2) 100%)",
                    border: "1px solid rgba(168, 230, 207, 0.3)",
                  }}
                >
                  <div className="grid grid-2" style={{ gap: "24px" }}>
                    <div className="text-center p-lg bg-white rounded-2xl">
                      <div className="text-4xl font-black gradient-text mb-sm">
                        +10,000
                      </div>
                      <p style={{ color: "#6b7280" }}>مستخدم نشط</p>
                    </div>
                    <div className="text-center p-lg bg-white rounded-2xl">
                      <div className="text-4xl font-black gradient-text mb-sm">
                        +50,000
                      </div>
                      <p style={{ color: "#6b7280" }}>بحث تم إنشاؤه</p>
                    </div>
                    <div className="text-center p-lg bg-white rounded-2xl">
                      <div className="text-4xl font-black gradient-text mb-sm">
                        +100,000
                      </div>
                      <p style={{ color: "#6b7280" }}>سؤال تم حله</p>
                    </div>
                    <div className="text-center p-lg bg-white rounded-2xl">
                      <div className="text-4xl font-black gradient-text mb-sm">
                        99%
                      </div>
                      <p style={{ color: "#6b7280" }}>رضا العملاء</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section bg-bg-secondary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #fda4af 100%)",
                }}
              >
                <Target size={32} className="text-white" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-lg"
                style={{ color: "#1f2937" }}
              >
                مهمتنا
              </h2>
              <p
                className="text-xl leading-relaxed mb-xl"
                style={{ color: "#4b5563" }}
              >
                مهمتنا في القطار هي تمكين كل شخص من إنشاء محتوى تعليمي احترافي
                بسهولة. نريد أن نجعل التعليم أكثر متعة وفعالية من خلال توفير
                أدوات ذكية تساعد الطلاب والمعلمين والباحثين على التركيز على ما
                يهم حقاً - التعلم والإبداع.
              </p>
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                style={{ backgroundColor: "rgba(168, 230, 207, 0.3)" }}
              >
                <Brain size={24} style={{ color: "#22c55e" }} />
                <span className="font-medium" style={{ color: "#1f2937" }}>
                  الذكاء الاصطناعي في خدمة التعليم
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-3xl"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-md"
                style={{ color: "#1f2937" }}
              >
                قيمنا
              </h2>
              <p style={{ color: "#6b7280" }}>المبادئ التي توجه عملنا كل يوم</p>
            </motion.div>

            <motion.div
              className="grid grid-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="text-center p-xl rounded-3xl bg-white border border-gray-100"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-lg`}
                  >
                    <value.icon size={28} className="text-white" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-sm"
                    style={{ color: "#1f2937" }}
                  >
                    {value.title}
                  </h3>
                  <p style={{ color: "#6b7280" }}>{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      

        {/* CTA Section */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center rounded-3xl p-3xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 230, 207, 0.3) 0%, rgba(147, 197, 253, 0.3) 100%)",
              }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-md"
                style={{ color: "#1f2937" }}
              >
                انضم إلينا في رحلة تحويل التعليم
              </h2>
              <p
                className="text-lg mb-xl max-w-2xl mx-auto"
                style={{ color: "#4b5563" }}
              >
                ابدأ اليوم واكتشف كيف يمكن للقطار أن يساعدك في إنشاء محتوى
                تعليمي احترافي
              </p>
              <div className="flex flex-wrap items-center justify-center gap-md">
                <Link to="/register">
                  <Button
                    size="lg"
                    icon={<ArrowLeft size={20} />}
                    iconPosition="end"
                  >
                    ابدأ مجاناً
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="secondary" size="lg">
                    تعرف على الأسعار
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
