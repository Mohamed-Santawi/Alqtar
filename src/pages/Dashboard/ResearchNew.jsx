import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  FileText,
  Check,
  Loader2,
  Save,
  ArrowLeft,
  Sparkles,
  User,
  MessageCircle,
  Upload,
  Link as LinkIcon,
  Palette,
  Bot,
  CheckSquare,
  Square,
  PlusCircle,
  BookOpen,
  X,
  FileDown,
} from "lucide-react";
import { generateResearchPaper } from "../../services/ai";
import { SketchPicker } from "react-color";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

export default function ResearchNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");
  const [researcherName, setResearcherName] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [researchContent, setResearchContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fontFamily, setFontFamily] = useState("Cairo");
  const [titleColor, setTitleColor] = useState("#000000");
  const [contentColor, setContentColor] = useState("#333333");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const [selectedCustomSections, setSelectedCustomSections] = useState({});
  const [hiddenSections, setHiddenSections] = useState([]);
  const [newSectionInput, setNewSectionInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [linkInput, setLinkInput] = useState("");
  const [references, setReferences] = useState([]);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [tokenUsage, setTokenUsage] = useState(null);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    introduction: true,
    tableOfContents: true,
    abstract: true,
    methodology: true,
    results: true,
    conclusion: true,
    references: true,
  });

  const sectionLabels = {
    introduction: "المقدمة",
    tableOfContents: "فهرس المحتوى",
    abstract: "الملخص",
    methodology: "المنهجية",
    results: "النتائج",
    conclusion: "الخاتمة",
    references: "المراجع",
  };

  const fontFamilies = [
    { value: "Cairo", label: "Cairo" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Amiri", label: "Amiri" },
    { value: "Tajawal", label: "Tajawal" },
    { value: "Noto Sans Arabic", label: "Noto Sans Arabic" },
  ];

  const colorPalette = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  // Template-specific styling configurations
  const templateStyles = {
    academic: {
      titleSize: "2em",
      contentSize: "1.1em",
      lineHeight: "1.8",
      spacing: "16px",
      titleSpacing: "24px",
      background: "#f9fafb",
      borderColor: "#e5e7eb",
    },
    modern: {
      titleSize: "2.2em",
      contentSize: "1.15em",
      lineHeight: "1.9",
      spacing: "20px",
      titleSpacing: "32px",
      background: "linear-gradient(to bottom, #f0f9ff, #ffffff)",
      borderColor: "#bfdbfe",
    },
    classic: {
      titleSize: "1.8em",
      contentSize: "1.05em",
      lineHeight: "1.7",
      spacing: "12px",
      titleSpacing: "20px",
      background: "#fefce8",
      borderColor: "#fde047",
    },
    thesis: {
      titleSize: "2.4em",
      contentSize: "1.2em",
      lineHeight: "2",
      spacing: "24px",
      titleSpacing: "40px",
      background: "#fafaf9",
      borderColor: "#d6d3d1",
    },
    newspaper: {
      titleSize: "2.5em",
      contentSize: "1em",
      lineHeight: "1.6",
      spacing: "8px",
      titleSpacing: "16px",
      background: "#ffffff",
      borderColor: "#000000",
    },
  };

  // Get current template style
  const currentTemplateStyle =
    templateStyles[selectedTemplate] || templateStyles.classic;

  // Debug: Log color changes
  useEffect(() => {
    console.log("[STATE] Colors updated:", {
      titleColor,
      contentColor,
      fontFamily,
    });
  }, [titleColor, contentColor, fontFamily]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Scroll Fade In Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".fade-on-scroll")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Load custom sections from Firestore
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.customSections && Array.isArray(data.customSections)) {
              setCustomSections(data.customSections);
            }
          }
        },
        (error) => {
          console.error("Error loading custom sections:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleSectionToggle = (section) => {
    setSelectedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // For TXT files, read content directly
      if (file.type === "text/plain") {
        const text = await file.text();
        console.log("File content:", text);
      }
    }
  };

  const handleAddCustomSection = async () => {
    if (newSectionInput.trim()) {
      const newSection = newSectionInput.trim();
      const updatedSections = [...customSections, newSection];
      setCustomSections(updatedSections);

      // Automatically select the new section
      setSelectedCustomSections((prev) => ({
        ...prev,
        [newSection]: true,
      }));

      setNewSectionInput("");

      // Save to Firestore
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(
            userDocRef,
            { customSections: updatedSections },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Error saving custom section:", error);
      }
    }
  };

  const handleRemoveCustomSection = async (index) => {
    const sectionToRemove = customSections[index];
    const updatedSections = customSections.filter((_, i) => i !== index);
    setCustomSections(updatedSections);

    // Remove from selectedCustomSections as well
    setSelectedCustomSections((prev) => {
      const newState = { ...prev };
      delete newState[sectionToRemove];
      return newState;
    });

    // Update Firestore
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          { customSections: updatedSections },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error removing custom section:", error);
    }
  };

  const handleToggleCustomSection = (section) => {
    setSelectedCustomSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setReferences([...references, { id: Date.now(), url: linkInput.trim() }]);
      setLinkInput("");
    }
  };

  const handleRemoveReference = (id) => {
    setReferences(references.filter((ref) => ref.id !== id));
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await generateResearchPaper(
        researchTopic || "موضوع البحث",
        researcherName,
        supervisorName,
        Object.keys(selectedSections)
          .filter((key) => selectedSections[key])
          .map((key) => sectionLabels[key]),
        userMsg
      );
      const aiResponse = response.choices[0]?.message?.content || "";
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
      setResearchContent(aiResponse);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResearch = async () => {
    if (!researchTopic.trim()) {
      alert("يرجى إدخال موضوع البحث");
      return;
    }
    setLoading(true);
    setChatHistory([]);
    setResearchContent("");
    setTokenUsage(null); // Reset token usage

    try {
      // Combine standard sections with custom sections
      const selectedSectionsList = Object.keys(selectedSections)
        .filter((key) => selectedSections[key])
        .map((key) => sectionLabels[key]);

      // Filter custom sections to only include selected ones
      const selectedCustomSectionsList = customSections.filter(
        (section) => selectedCustomSections[section]
      );

      const allSections = [
        ...selectedSectionsList,
        ...selectedCustomSectionsList,
      ];

      // Build user instructions (only references, no formatting details)
      let additionalInstructions = "";

      if (references.length > 0) {
        additionalInstructions += `\n\nالمراجع المرفقة:\n${references
          .map((ref, index) => `${index + 1}. ${ref.url}`)
          .join("\n")}`;
      }

      if (urlInput.trim()) {
        additionalInstructions += `\nرابط مرجعي إضافي: ${urlInput.trim()}`;
      }

      console.log("🚀 Starting research generation with:", {
        topic: researchTopic,
        sections: allSections,
      });

      const response = await generateResearchPaper(
        researchTopic,
        researcherName,
        supervisorName,
        allSections,
        chatHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n") +
          additionalInstructions
      );

      console.log("📦 API Response:", response);

      const content = response.choices?.[0]?.message?.content || "";

      console.log("📝 Extracted content length:", content.length);
      console.log("📝 Content preview:", content.substring(0, 200));

      if (!content) {
        console.error("❌ No content extracted from response!");
        alert("لم يتم العثور على محتوى في الاستجابة. يرجى المحاولة مرة أخرى.");
        return;
      }

      setResearchContent(content);
      setChatHistory([{ role: "assistant", content: "تم إنشاء البحث بنجاح!" }]);

      console.log("✅ Research content set successfully");

      // Capture token usage if available
      if (response.usage) {
        setTokenUsage(response.usage);
      }
    } catch (error) {
      console.error("❌ Error generating research:", error);
      alert(`حدث خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span>العودة</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-3">
        {/* Page Title - Fade in */}
        <div className="fade-on-scroll mb-10 mt-4 bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            إنشاء بحث علمي جديد
          </h1>
          <p className="text-gray-600 text-center text-lg">
            خاصة لإعداد مخطط علمي دقيق وفقاً لأحدث التقنيات والمعايير
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sidebar - Research Structure */}
          <div className="lg:col-span-1 fade-on-scroll">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl px-6 py-6 shadow-lg">
              <h2
                className="text-white font-bold text-2xl mb-6 flex items-center gap-3"
                dir="rtl"
              >
                <FileText size={28} />
                هيكل البحث
              </h2>

              <div className="space-y-3">
                {/* Display custom sections first */}
                {customSections.map((section, index) => (
                  <button
                    key={`custom-${index}`}
                    onClick={() => handleToggleCustomSection(section)}
                    className="w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 group"
                    dir="rtl"
                  >
                    {selectedCustomSections[section] ? (
                      <CheckSquare
                        className="text-white group-hover:scale-110 transition-transform"
                        size={24}
                      />
                    ) : (
                      <Square
                        className="text-white/70 group-hover:scale-110 transition-transform"
                        size={24}
                      />
                    )}
                    <span
                      className={`flex-1 font-semibold text-base ${
                        selectedCustomSections[section]
                          ? "text-white"
                          : "text-white/80"
                      }`}
                    >
                      {section}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustomSection(index);
                      }}
                      className="transition-all cursor-pointer text-white/70 hover:scale-110 p-1"
                    >
                      <X size={18} className="text-current" />
                    </div>
                  </button>
                ))}

                {/* Then standard sections */}
                {Object.entries(sectionLabels)
                  .filter(([key]) => !hiddenSections.includes(key))
                  .map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleSectionToggle(key)}
                      className="w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 group"
                      dir="rtl"
                    >
                      {selectedSections[key] ? (
                        <CheckSquare
                          className="text-white group-hover:scale-110 transition-transform"
                          size={24}
                        />
                      ) : (
                        <Square
                          className="text-white/70 group-hover:scale-110 transition-transform"
                          size={24}
                        />
                      )}
                      <span
                        className={`flex-1 font-semibold text-base ${
                          selectedSections[key] ? "text-white" : "text-white/80"
                        }`}
                      >
                        {label}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          // Hide/remove the section from the list
                          setHiddenSections((prev) => [...prev, key]);
                        }}
                        className="transition-all cursor-pointer text-white/70 hover:scale-110 p-1"
                      >
                        <X size={18} className="text-current" />
                      </div>
                    </button>
                  ))}
              </div>

              {/* Custom Section Input */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-3"
                  dir="rtl"
                >
                  اضافة قسم لهيكل البحث
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSectionInput}
                    onChange={(e) => setNewSectionInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCustomSection()
                    }
                    placeholder="اسم القسم الجديد..."
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40 outline-none"
                    dir="rtl"
                  />
                  <button
                    onClick={handleAddCustomSection}
                    className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle className="text-white" size={18} />
                    <span className="text-white font-semibold">اضافة</span>
                  </button>
                </div>
              </div>

              {/* Templates */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-4"
                  dir="rtl"
                >
                  القوالب الجاهزة
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "academic", label: "أكاديمي", icon: "📚" },
                    { id: "modern", label: "حديث", icon: "✨" },
                    { id: "classic", label: "تقليدي", icon: "📄" },
                    { id: "thesis", label: "رسالة", icon: "🎓" },
                    { id: "newspaper", label: "صحفي", icon: "📰" },
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        selectedTemplate === template.id
                          ? "bg-white/25 border-2 border-white"
                          : "bg-white/10 border-2 border-white/20 hover:bg-white/15"
                      }`}
                      dir="rtl"
                    >
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <div className="text-white font-semibold text-sm">
                        {template.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selector */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-3"
                  dir="rtl"
                >
                  نوع الخط
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-white/40 outline-none cursor-pointer"
                  dir="rtl"
                  style={{ fontFamily }}
                >
                  {fontFamilies.map((font) => (
                    <option
                      key={font.value}
                      value={font.value}
                      style={{
                        fontFamily: font.value,
                        background: "#d97706",
                        color: "white",
                      }}
                    >
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Pickers */}
              <div className="mt-6 pt-6 border-t border-white/20 space-y-4">
                <div>
                  <label
                    className="block text-white font-semibold text-base mb-3"
                    dir="rtl"
                  >
                    لون العناوين
                  </label>
                  <input
                    type="text"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    placeholder="#000000"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-white/40 outline-none font-mono text-sm"
                    dir="ltr"
                  />
                  {/* Preset Colors */}
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {[
                      "#000000",
                      "#ff0000",
                      "#00ff00",
                      "#0000ff",
                      "#ffff00",
                      "#ff00ff",
                      "#00ffff",
                      "#ff6600",
                      "#6600ff",
                      "#00ff99",
                      "#ff0099",
                      "#999999",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTitleColor(color)}
                        className="w-full h-10 rounded-lg border-2 border-white/30 hover:border-white hover:scale-105 cursor-pointer transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-white font-semibold text-base mb-3"
                    dir="rtl"
                  >
                    لون المحتوى
                  </label>
                  <input
                    type="text"
                    value={contentColor}
                    onChange={(e) => setContentColor(e.target.value)}
                    placeholder="#333333"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/15 focus:border-white/40 outline-none font-mono"
                    dir="ltr"
                  />
                  {/* Preset Colors */}
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {[
                      "#000000",
                      "#333333",
                      "#666666",
                      "#999999",
                      "#1a1a1a",
                      "#2d2d2d",
                      "#404040",
                      "#737373",
                      "#0d47a1",
                      "#b71c1c",
                      "#1b5e20",
                      "#f57c00",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setContentColor(color)}
                        className="w-full h-10 rounded-lg border-2 border-white/30 hover:border-white cursor-pointer transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Tools Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-4"
                  dir="rtl"
                >
                  <Sparkles size={18} className="inline ml-2" />
                  أدوات إضافية
                </label>

                {/* File Upload */}
                <div className="space-y-3">
                  <label className="block text-white text-sm mb-2" dir="rtl">
                    <Upload size={16} className="inline ml-2" />
                    رفع ملف مرجعي
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="block w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-dashed border-white/30 hover:bg-white/15 hover:border-white/50 transition-all cursor-pointer text-center"
                  >
                    <p className="text-white text-sm">
                      {uploadedFile
                        ? uploadedFile.name
                        : "اختر ملف (PDF, Word, TXT)"}
                    </p>
                  </label>
                  {uploadedFile && (
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="w-full px-3 py-2 cursor-pointer rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white text-sm transition-colors"
                    >
                      إزالة الملف
                    </button>
                  )}
                </div>
              </div>

              {/* Add Link Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-3"
                  dir="rtl"
                >
                  <LinkIcon size={18} className="inline ml-2" />
                  إضافة رابط
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
                    placeholder="أدخل رابط مرجعي..."
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40 outline-none text-sm"
                    dir="rtl"
                  />
                  <button
                    onClick={handleAddLink}
                    className="px-4 py-3 cursor-pointer rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
              </div>

              {/* Manage References Section */}
              {references.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <label
                    className="block text-white font-semibold text-base mb-3"
                    dir="rtl"
                  >
                    <BookOpen size={18} className="inline ml-2" />
                    إدارة المراجع ({references.length})
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {references.map((ref) => (
                      <div
                        key={ref.id}
                        className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
                      >
                        <LinkIcon
                          size={16}
                          className="text-amber-400 flex-shrink-0"
                        />
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-white text-sm truncate hover:text-amber-300 transition-colors"
                          dir="ltr"
                        >
                          {ref.url}
                        </a>
                        <button
                          onClick={() => handleRemoveReference(ref.id)}
                          className="opacity-0 cursor-pointer group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        >
                          <X size={16} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Export Format Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-4"
                  dir="rtl"
                >
                  <FileDown size={18} className="inline ml-2" />
                  تنسيق الحفظ
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* PDF */}
                  <button
                    onClick={() => setExportFormat("pdf")}
                    className={`p-4 cursor-pointer rounded-lg border-2 transition-all text-center ${
                      exportFormat === "pdf"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <FileText
                      size={24}
                      className={`mx-auto mb-2 ${
                        exportFormat === "pdf"
                          ? "text-amber-400"
                          : "text-white/70"
                      }`}
                    />
                    <p className="text-white text-xs font-semibold">PDF</p>
                  </button>

                  {/* HTML */}
                  <button
                    onClick={() => setExportFormat("html")}
                    className={`p-4 cursor-pointer rounded-lg border-2 transition-all text-center ${
                      exportFormat === "html"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <FileText
                      size={24}
                      className={`mx-auto mb-2 ${
                        exportFormat === "html"
                          ? "text-amber-400"
                          : "text-white/70"
                      }`}
                    />
                    <p className="text-white text-xs font-semibold">HTML</p>
                  </button>

                  {/* Word */}
                  <button
                    onClick={() => setExportFormat("docx")}
                    className={`p-4 cursor-pointer rounded-lg border-2 transition-all text-center ${
                      exportFormat === "docx"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <FileText
                      size={24}
                      className={`mx-auto mb-2 ${
                        exportFormat === "docx"
                          ? "text-amber-400"
                          : "text-white/70"
                      }`}
                    />
                    <p className="text-white text-xs font-semibold">Word</p>
                  </button>

                  {/* PPTX */}
                  <button
                    onClick={() => setExportFormat("pptx")}
                    className={`p-4 cursor-pointer rounded-lg border-2 transition-all text-center ${
                      exportFormat === "pptx"
                        ? "border-amber-500 bg-amber-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <FileText
                      size={24}
                      className={`mx-auto mb-2 ${
                        exportFormat === "pptx"
                          ? "text-amber-400"
                          : "text-white/70"
                      }`}
                    />
                    <p className="text-white text-xs font-semibold">PPTX</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <div className="fade-on-scroll bg-white rounded-3xl p-8 shadow-md border border-gray-100">
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-gray-800 font-bold mb-3 text-lg"
                    dir="rtl"
                  >
                    موضوع البحث <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="أدخل موضوع البحث..."
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-lg transition-all shadow-sm"
                    dir="rtl"
                    required
                    minLength={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-3"
                      dir="rtl"
                    >
                      اسم الطالب
                    </label>
                    <input
                      type="text"
                      value={researcherName}
                      onChange={(e) => setResearcherName(e.target.value)}
                      placeholder="الاسم"
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-3"
                      dir="rtl"
                    >
                      اسم المشرف
                    </label>
                    <input
                      type="text"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value)}
                      placeholder="الاسم"
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Token Usage Display */}
            {tokenUsage && (
              <div className="fade-on-scroll mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md border border-green-200">
                <h3
                  className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2"
                  dir="rtl"
                >
                  <Sparkles size={20} className="text-green-600" />
                  إحصائيات الاستخدام
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" dir="rtl">
                      الإدخال
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {tokenUsage.prompt_tokens}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">رمز</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" dir="rtl">
                      المخرجات
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {tokenUsage.completion_tokens}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">رمز</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" dir="rtl">
                      الإجمالي
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {tokenUsage.total_tokens}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">رمز</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" dir="rtl">
                      التكلفة التقريبية
                    </p>
                    <p className="text-xl font-bold text-amber-700">
                      ${(tokenUsage.total_tokens * 0.000001).toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">رصيد</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Interface */}
            <div className="fade-on-scroll bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5">
                <div className="flex items-center gap-3 text-white">
                  <MessageCircle size={24} />
                  <h2 className="font-bold text-lg flex-1">
                    المحادثة التفاعلية
                  </h2>
                  <Bot size={24} className="opacity-80" />
                </div>
              </div>

              <div
                className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto bg-gray-50"
                dir="rtl"
              >
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <Sparkles className="text-amber-600" size={32} />
                    </div>
                    <p className="text-lg font-semibold text-gray-700">
                      ابدأ المحادثة
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      اطرح أسئلتك أو اطلب تعديلات
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {msg.role === "user" ? (
                              <User size={16} className="text-white/90" />
                            ) : (
                              <Bot size={16} className="text-amber-600" />
                            )}
                            <span
                              className={`text-xs font-bold ${
                                msg.role === "user"
                                  ? "text-white/90"
                                  : "text-gray-600"
                              }`}
                            >
                              {msg.role === "user" ? "أنت" : "المساعد"}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 rounded-xl border border-blue-200">
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={20}
                        />
                        <span className="text-blue-700 font-semibold">
                          جاري المعالجة...
                        </span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-200 space-y-5">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-8 py-6 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-none text-xl transition-all bg-white shadow-sm font-medium"
                    dir="rtl"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !chatMessage.trim()}
                    className="px-8 py-6 cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send size={24} />
                  </button>
                </div>

                <button
                  onClick={handleGenerateResearch}
                  disabled={loading || !researchTopic.trim()}
                  className="w-full px-8 py-5 cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>جاري الإنشاء...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>إنشاء البحث</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Research Output */}
            {researchContent && (
              <div className="fade-on-scroll bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 flex-1">
                    محتوى البحث
                  </h2>
                  <button
                    onClick={() => {
                      // Create formatted document with styling
                      const styledContent = `
                        <!DOCTYPE html>
                        <html dir="rtl" lang="ar">
                        <head>
                          <meta charset="UTF-8">
                          <title>بحث علمي - ${researchTopic}</title>
                          <style>
                            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Amiri&family=Tajawal&display=swap');
                            body {
                              font-family: '${fontFamily}', sans-serif;
                              color: ${contentColor};
                              line-height: 1.8;
                              padding: 40px;
                              max-width: 800px;
                              margin: 0 auto;
                            }
                            h1, h2, h3, h4, h5, h6 {
                              color: ${titleColor};
                              font-weight: 700;
                              margin-top: 24px;
                              margin-bottom: 12px;
                            }
                            h1 { font-size: 2.5em; }
                            h2 { font-size: 2em; }
                            h3 { font-size: 1.5em; }
                            p {
                              margin: 12px 0;
                              font-size: 1.1em;
                              padding-right: 8px;
                            }
                            @media print {
                              body { padding: 20px; }
                            }
                          </style>
                        </head>
                        <body>
                          ${researchContent
                            .split("\n")
                            .map((line) => {
                              const trimmed = line.trim();
                              if (!trimmed) return "<br>";
                              // Detect headers - lines that are short and likely titles
                              if (
                                trimmed.length < 100 &&
                                (trimmed.includes(":") ||
                                  trimmed.match(
                                    /^(المقدمة|الملخص|المنهجية|النتائج|الخاتمة|المراجع|فهرس)/i
                                  ) ||
                                  trimmed === researchTopic)
                              ) {
                                return `<h2>${trimmed}</h2>`;
                              }
                              return `<p>${trimmed}</p>`;
                            })
                            .join("\n")}
                        </body>
                        </html>
                      `;

                      // Handle different export formats
                      if (exportFormat === "pdf") {
                        // Create a new window with the content and trigger print
                        const printWindow = window.open("", "_blank");
                        printWindow.document.write(styledContent);
                        printWindow.document.close();
                        printWindow.focus();
                        setTimeout(() => {
                          printWindow.print();
                        }, 250);
                      } else if (exportFormat === "html") {
                        // Download as HTML
                        const blob = new Blob([styledContent], {
                          type: "text/html",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${researchTopic || "بحث علمي"}.html`;
                        a.click();
                        URL.revokeObjectURL(url);
                      } else if (exportFormat === "docx") {
                        alert(
                          "تحويل Word قريباً! حالياً يمكنك تحميل HTML ثم فتحه في Word."
                        );
                      } else if (exportFormat === "pptx") {
                        alert(
                          "تحويل PowerPoint قريباً! حالياً يمكنك تحميل HTML أو PDF."
                        );
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save size={20} />
                    <span>تحميل البحث</span>
                  </button>
                </div>

                {/* Styled Research Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dir="rtl"
                  style={{
                    fontFamily: fontFamily,
                    color: contentColor,
                  }}
                >
                  <div
                    className="p-6 rounded-xl"
                    style={{
                      background: currentTemplateStyle.background,
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: currentTemplateStyle.borderColor,
                    }}
                  >
                    {(() => {
                      console.log(
                        "🎨 Rendering research content. Length:",
                        researchContent.length
                      );

                      // Create pattern for all section names (standard + custom)
                      const allSectionNames = [
                        ...Object.values(sectionLabels),
                        ...customSections,
                      ].join("|");
                      const sectionPattern = new RegExp(
                        `^(${allSectionNames})`,
                        "i"
                      );

                      return researchContent.split("\n").map((line, index) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <br key={index} />;

                        // Detect if line is a title/header
                        const isTitle =
                          trimmed.length < 100 &&
                          (trimmed.includes(":") ||
                            sectionPattern.test(trimmed) ||
                            trimmed === researchTopic ||
                            index < 3); // First few lines are likely titles

                        if (isTitle) {
                          return (
                            <h2
                              key={index}
                              style={{
                                color: titleColor, // This should change when titleColor state changes
                                fontWeight: 700,
                                fontSize: currentTemplateStyle.titleSize,
                                marginTop: currentTemplateStyle.titleSpacing,
                                marginBottom: "12px",
                                lineHeight: "1.4",
                              }}
                            >
                              {trimmed}
                            </h2>
                          );
                        }

                        return (
                          <p
                            key={index}
                            style={{
                              color: contentColor, // This should change when contentColor state changes
                              fontSize: currentTemplateStyle.contentSize,
                              lineHeight: currentTemplateStyle.lineHeight,
                              marginBottom: currentTemplateStyle.spacing,
                              paddingRight: "8px",
                              fontWeight: 400,
                            }}
                          >
                            {trimmed}
                          </p>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
