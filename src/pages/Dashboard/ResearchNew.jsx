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
  ChevronUp,
  ChevronDown,
  Menu,
} from "lucide-react";
import { generateResearchPaper } from "../../services/ai";
import { SketchPicker } from "react-color";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

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
  const [newContentInput, setNewContentInput] = useState("");
  const [newContentSection, setNewContentSection] = useState("");
  const [urlInput] = useState("");
  const [fontFamily, setFontFamily] = useState("Cairo");
  const [titleColor, setTitleColor] = useState("#000000");
  const [contentColor, setContentColor] = useState("#333333");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [selectedCustomSections, setSelectedCustomSections] = useState({});
  const [hiddenSections, setHiddenSections] = useState([]);
  const [newSectionInput, setNewSectionInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [linkInput, setLinkInput] = useState("");
  const [references, setReferences] = useState([]);
  const [referenceStyle, setReferenceStyle] = useState("apa"); // apa, ieee, mla
  const [exportFormat, setExportFormat] = useState("pdf");
  const [tokenUsage, setTokenUsage] = useState(null);
  const [selectedDecoration, setSelectedDecoration] = useState("none");
  const [decorationSpacing, setDecorationSpacing] = useState({
    padding: 20,
    margin: 16,
    borderWidth: 2,
  });
  const [selectedSections, setSelectedSections] = useState({
    introduction: true,
    tableOfContents: true,
    abstract: true,
    methodology: true,
    results: true,
    conclusion: true,
    references: true,
  });
  // ترتيب الأقسام - قائمة موحدة تحتوي على جميع الأقسام (قياسية + مخصصة)
  // الأقسام القياسية تبدأ بـ "standard:" والأقسام المخصصة تبدأ بـ "custom:"
  const [unifiedSectionOrder, setUnifiedSectionOrder] = useState([
    "standard:introduction",
    "standard:abstract",
    "standard:methodology",
    "standard:results",
    "standard:conclusion",
    "standard:references",
  ]);

  const sectionLabels = {
    introduction: "المقدمة",
    tableOfContents: "فهرس المحتوى",
    abstract: "الملخص",
    methodology: "منهجية المحتوى",
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

  // Decoration and Frame Styles
  const decorationStyles = {
    none: {
      name: "بدون زخرفة",
      icon: "📄",
      className: "",
      borderStyle: "none",
      borderWidth: 0,
      boxShadow: "none",
      background: "transparent",
    },
    simple: {
      name: "إطار بسيط",
      icon: "▭",
      className: "",
      borderStyle: "solid",
      borderWidth: "2px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      background: "transparent",
    },
    elegant: {
      name: "إطار أنيق",
      icon: "◈",
      className: "",
      borderStyle: "double",
      borderWidth: "4px",
      borderColor: "#92400e",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      background: "transparent",
    },
    ornate: {
      name: "إطار مزخرف",
      icon: "◊",
      className: "",
      borderStyle: "solid",
      borderWidth: "3px",
      borderColor: "#d97706",
      boxShadow:
        "0 8px 16px rgba(217, 119, 6, 0.2), inset 0 0 0 1px rgba(217, 119, 6, 0.1)",
      background:
        "linear-gradient(to bottom, rgba(254, 252, 232, 0.3), rgba(255, 255, 255, 0.1))",
    },
    modern: {
      name: "إطار عصري",
      icon: "⬛",
      className: "",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#3b82f6",
      boxShadow:
        "0 4px 12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.05)",
      background:
        "linear-gradient(135deg, rgba(239, 246, 255, 0.5), rgba(255, 255, 255, 0.8))",
    },
    classic: {
      name: "إطار كلاسيكي",
      icon: "▣",
      className: "",
      borderStyle: "ridge",
      borderWidth: "5px",
      borderColor: "#78716c",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1)",
      background:
        "linear-gradient(to bottom, rgba(250, 250, 249, 0.8), rgba(245, 245, 244, 0.6))",
    },
    decorative: {
      name: "زخرفة متقدمة",
      icon: "✦",
      className: "",
      borderStyle: "solid",
      borderWidth: "2px",
      borderColor: "#8b5cf6",
      boxShadow:
        "0 0 0 4px rgba(139, 92, 246, 0.1), 0 4px 12px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.5)",
      background:
        "linear-gradient(135deg, rgba(237, 233, 254, 0.4), rgba(221, 214, 254, 0.2))",
    },
    minimal: {
      name: "إطار بسيط جداً",
      icon: "▬",
      className: "",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      background: "transparent",
    },
    // Word-like Professional Styles
    wordClassic: {
      name: "Word كلاسيكي",
      icon: "📘",
      className: "",
      borderStyle: "solid",
      borderWidth: "3px",
      borderColor: "#1e40af",
      boxShadow:
        "0 2px 8px rgba(30, 64, 175, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
      background:
        "linear-gradient(to bottom, rgba(239, 246, 255, 0.6), rgba(255, 255, 255, 0.9))",
      borderImage: "none",
    },
    wordElegant: {
      name: "Word أنيق",
      icon: "📗",
      className: "",
      borderStyle: "double",
      borderWidth: "6px",
      borderColor: "#059669",
      boxShadow:
        "0 4px 12px rgba(5, 150, 105, 0.15), inset 0 0 0 2px rgba(5, 150, 105, 0.1)",
      background:
        "linear-gradient(135deg, rgba(236, 253, 245, 0.5), rgba(209, 250, 229, 0.3))",
    },
    wordFormal: {
      name: "Word رسمي",
      icon: "📕",
      className: "",
      borderStyle: "ridge",
      borderWidth: "4px",
      borderColor: "#7c2d12",
      boxShadow:
        "inset 0 2px 4px rgba(124, 45, 18, 0.1), 0 2px 8px rgba(124, 45, 18, 0.15)",
      background:
        "linear-gradient(to bottom, rgba(254, 242, 242, 0.4), rgba(255, 255, 255, 0.8))",
    },
    wordModern: {
      name: "Word عصري",
      icon: "📙",
      className: "",
      borderStyle: "solid",
      borderWidth: "2px",
      borderColor: "#7c3aed",
      boxShadow:
        "0 0 0 3px rgba(124, 58, 237, 0.1), 0 4px 16px rgba(124, 58, 237, 0.2)",
      background:
        "linear-gradient(135deg, rgba(245, 243, 255, 0.6), rgba(237, 233, 254, 0.4))",
    },
    wordAcademic: {
      name: "Word أكاديمي",
      icon: "📚",
      className: "",
      borderStyle: "groove",
      borderWidth: "5px",
      borderColor: "#475569",
      boxShadow:
        "inset 0 3px 6px rgba(71, 85, 105, 0.1), 0 3px 10px rgba(71, 85, 105, 0.15)",
      background:
        "linear-gradient(to bottom, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))",
    },
    wordDecorative1: {
      name: "زخرفة Word 1",
      icon: "✨",
      className: "",
      borderStyle: "solid",
      borderWidth: "4px",
      borderColor: "#dc2626",
      boxShadow:
        "0 0 0 4px rgba(220, 38, 38, 0.1), 0 0 0 8px rgba(220, 38, 38, 0.05), 0 6px 20px rgba(220, 38, 38, 0.2)",
      background:
        "linear-gradient(135deg, rgba(254, 242, 242, 0.5), rgba(254, 226, 226, 0.3))",
    },
    wordDecorative2: {
      name: "زخرفة Word 2",
      icon: "🌟",
      className: "",
      borderStyle: "double",
      borderWidth: "8px",
      borderColor: "#ea580c",
      boxShadow:
        "0 0 0 2px rgba(234, 88, 12, 0.2), 0 4px 16px rgba(234, 88, 12, 0.25)",
      background:
        "linear-gradient(to bottom, rgba(255, 247, 237, 0.6), rgba(254, 243, 199, 0.4))",
    },
    wordDecorative3: {
      name: "زخرفة Word 3",
      icon: "💫",
      className: "",
      borderStyle: "outset",
      borderWidth: "5px",
      borderColor: "#0891b2",
      boxShadow:
        "inset 0 2px 4px rgba(8, 145, 178, 0.1), 0 4px 12px rgba(8, 145, 178, 0.2)",
      background:
        "linear-gradient(135deg, rgba(236, 254, 255, 0.6), rgba(207, 250, 254, 0.4))",
    },
    wordDecorative4: {
      name: "زخرفة Word 4",
      icon: "🎨",
      className: "",
      borderStyle: "solid",
      borderWidth: "3px",
      borderColor: "#a855f7",
      boxShadow:
        "0 0 0 2px rgba(168, 85, 247, 0.15), 0 0 0 5px rgba(168, 85, 247, 0.08), 0 6px 24px rgba(168, 85, 247, 0.25)",
      background:
        "linear-gradient(135deg, rgba(250, 245, 255, 0.7), rgba(243, 232, 255, 0.5))",
    },
    wordDecorative5: {
      name: "زخرفة Word 5",
      icon: "🎯",
      className: "",
      borderStyle: "ridge",
      borderWidth: "6px",
      borderColor: "#16a34a",
      boxShadow:
        "inset 0 3px 6px rgba(22, 163, 74, 0.1), 0 0 0 3px rgba(22, 163, 74, 0.1), 0 4px 16px rgba(22, 163, 74, 0.2)",
      background:
        "linear-gradient(to bottom, rgba(240, 253, 244, 0.6), rgba(220, 252, 231, 0.4))",
    },
    wordDecorative6: {
      name: "زخرفة Word 6",
      icon: "🔷",
      className: "",
      borderStyle: "double",
      borderWidth: "10px",
      borderColor: "#0ea5e9",
      boxShadow:
        "0 0 0 4px rgba(14, 165, 233, 0.1), 0 0 0 8px rgba(14, 165, 233, 0.05), 0 8px 24px rgba(14, 165, 233, 0.25)",
      background:
        "linear-gradient(135deg, rgba(224, 242, 254, 0.7), rgba(186, 230, 253, 0.5))",
    },
  };

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

  // دالة لتحريك قسم لأعلى في القائمة الموحدة
  const moveSectionUp = (sectionKey, isCustom = false) => {
    const unifiedKey = isCustom
      ? `custom:${sectionKey}`
      : `standard:${sectionKey}`;
    const currentIndex = unifiedSectionOrder.indexOf(unifiedKey);
    if (currentIndex > 0) {
      const newOrder = [...unifiedSectionOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
        newOrder[currentIndex],
        newOrder[currentIndex - 1],
      ];
      setUnifiedSectionOrder(newOrder);
    }
  };

  // دالة لتحريك قسم لأسفل في القائمة الموحدة
  const moveSectionDown = (sectionKey, isCustom = false) => {
    const unifiedKey = isCustom
      ? `custom:${sectionKey}`
      : `standard:${sectionKey}`;
    const currentIndex = unifiedSectionOrder.indexOf(unifiedKey);
    if (currentIndex < unifiedSectionOrder.length - 1 && currentIndex !== -1) {
      const newOrder = [...unifiedSectionOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setUnifiedSectionOrder(newOrder);
    }
  };

  // تحديث القائمة الموحدة عند إضافة قسم مخصص جديد
  useEffect(() => {
    customSections.forEach((section) => {
      const unifiedKey = `custom:${section}`;
      setUnifiedSectionOrder((prev) => {
        if (!prev.includes(unifiedKey)) {
          // إضافة القسم المخصص الجديد في نهاية القائمة
          return [...prev, unifiedKey];
        }
        return prev;
      });
    });
  }, [customSections]);

  // إزالة الأقسام المحذوفة من القائمة الموحدة
  useEffect(() => {
    setUnifiedSectionOrder((prev) =>
      prev.filter((key) => {
        if (key.startsWith("custom:")) {
          const sectionName = key.replace("custom:", "");
          return customSections.includes(sectionName);
        }
        return true;
      })
    );
  }, [customSections]);

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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const imagePromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              url: e.target.result,
              file: file,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(imagePromises);
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
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

  // دالة لإضافة أسماء الطالب والمشرف في بداية البحث
  const addNamesToContent = (content) => {
    // التحقق من وجود الأسماء في بداية المحتوى بالفعل
    const hasNamesAtStart =
      content.trim().startsWith("الطالب:") ||
      content.trim().startsWith("المشرف:");

    // إذا كانت الأسماء موجودة في البداية، لا نضيفها مرة أخرى
    if (hasNamesAtStart) {
      return content;
    }

    // إضافة معلومات الطالب والمشرف في بداية البحث
    if (researcherName.trim() || supervisorName.trim()) {
      let namesSection = "";

      if (researcherName.trim() && supervisorName.trim()) {
        namesSection = `الطالب: ${researcherName.trim()}\nالمشرف: ${supervisorName.trim()}\n\n`;
      } else if (researcherName.trim()) {
        namesSection = `الطالب: ${researcherName.trim()}\n\n`;
      } else if (supervisorName.trim()) {
        namesSection = `المشرف: ${supervisorName.trim()}\n\n`;
      }

      // إضافة الأسماء في بداية المحتوى
      return namesSection + content;
    }

    return content;
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      // استيراد chatCompletion للاستخدام في المحادثة
      const { chatCompletion } = await import("../../services/ai");

      // بناء رسائل المحادثة
      const messages = [
        {
          role: "system",
          content: `أنت مساعد ذكي متخصص في المساعدة في كتابة البحوث العلمية باللغة العربية.
          مهمتك هي:
          - الإجابة على أسئلة المستخدم حول البحث
          - تقديم نصائح وإرشادات حول كتابة البحوث
          - المساعدة في تحسين وتطوير المحتوى
          - الرد بالعربية فقط
          ${
            researchContent.trim()
              ? `\n\nملاحظة: يوجد بحث موجود حالياً حول موضوع: ${researchTopic}`
              : ""
          }`,
        },
        ...chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: userMsg,
        },
      ];

      const response = await chatCompletion(messages, {
        model: "openai/gpt-5-nano-2025-08-07",
        maxTokens: 2000,
        temperature: 0.7,
      });

      const aiResponse = response.choices?.[0]?.message?.content || "";
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);

      // Capture token usage if available
      if (response.usage) {
        setTokenUsage((prev) => {
          if (prev) {
            return {
              prompt_tokens:
                prev.prompt_tokens + (response.usage.prompt_tokens || 0),
              completion_tokens:
                prev.completion_tokens +
                (response.usage.completion_tokens || 0),
              total_tokens:
                prev.total_tokens + (response.usage.total_tokens || 0),
            };
          }
          return response.usage;
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
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

    // إذا كان هناك محتوى موجود، اطلب تأكيد من المستخدم
    if (researchContent.trim()) {
      const confirmNew = window.confirm(
        "يوجد بحث موجود بالفعل. هل تريد إنشاء بحث جديد؟ سيتم حذف البحث الحالي."
      );
      if (!confirmNew) {
        return;
      }
    }

    setLoading(true);
    setChatHistory([]);
    setResearchContent("");
    setTokenUsage(null); // Reset token usage

    try {
      // Combine standard sections with custom sections according to unified order
      const allSections = unifiedSectionOrder
        .filter((unifiedKey) => {
          if (unifiedKey.startsWith("standard:")) {
            const key = unifiedKey.replace("standard:", "");
            return selectedSections[key] && sectionLabels[key];
          } else if (unifiedKey.startsWith("custom:")) {
            const section = unifiedKey.replace("custom:", "");
            return selectedCustomSections[section];
          }
          return false;
        })
        .map((unifiedKey) => {
          if (unifiedKey.startsWith("standard:")) {
            const key = unifiedKey.replace("standard:", "");
            return sectionLabels[key];
          } else if (unifiedKey.startsWith("custom:")) {
            return unifiedKey.replace("custom:", "");
          }
          return "";
        })
        .filter(Boolean);

      // Build user instructions (only references, no formatting details)
      let additionalInstructions = "";

      // تعليمات واضحة جداً للأقسام المحددة فقط
      if (allSections.length > 0) {
        additionalInstructions += `\n\n⚠️ تعليمات مهمة جداً:\n`;
        additionalInstructions += `يجب كتابة البحث وتضمين فقط الأقسام التالية:\n`;
        allSections.forEach((section) => {
          additionalInstructions += `${section}\n`;
        });
        additionalInstructions += `\nممنوع كتابة أي أقسام أخرى غير المذكورة أعلاه. اكتب فقط الأقسام المحددة.\n`;
        additionalInstructions += `⚠️ مهم جداً: لا تكرر أي قسم - كل قسم يجب أن يظهر مرة واحدة فقط.\n`;
        additionalInstructions += `⚠️ مهم جداً: لا تكتب "فهرس المحتوى" كقسم في المحتوى.\n`;
      }

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
        sectionsCount: allSections.length,
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

      // إضافة أسماء الطالب والمشرف في بداية البحث
      const contentWithNames = addNamesToContent(content);
      setResearchContent(contentWithNames);
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

  // دالة لاستخراج جميع الأقسام من المحتوى (العناوين فقط)
  const extractSections = (content) => {
    const sections = [];
    const seenSections = new Set(); // لمنع التكرار
    const lines = content.split("\n");
    const allSectionNames = [
      ...Object.values(sectionLabels),
      ...customSections,
      researchTopic,
    ];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // استبعاد الفهرس نفسه من القائمة
      if (trimmed.includes("فهرس المحتوى") || trimmed.match(/^فهرس/i)) {
        return;
      }

      // استبعاد الأسماء (الطالب/المشرف)
      if (trimmed.startsWith("الطالب:") || trimmed.startsWith("المشرف:")) {
        return;
      }

      // استبعاد السطور الطويلة (المحتوى وليس العناوين)
      if (trimmed.length > 80) {
        return;
      }

      // التحقق إذا كان السطر عنوان قسم (سطر قصير فقط)
      const isSection = allSectionNames.some((sectionName) => {
        const normalizedLine = trimmed
          .replace(/[:\-–—]/g, "")
          .trim()
          .toLowerCase();
        const normalizedSection = sectionName
          .replace(/[:\-–—]/g, "")
          .trim()
          .toLowerCase();

        // مطابقة مباشرة
        if (normalizedLine === normalizedSection) return true;

        // مطابقة جزئية (للأقسام المخصصة) - فقط إذا كان السطر قصير
        if (trimmed.length <= 50) {
          if (
            normalizedLine.includes(normalizedSection) ||
            normalizedSection.includes(normalizedLine)
          ) {
            return true;
          }
        }

        // للأنماط القياسية - فقط السطور القصيرة
        if (
          trimmed.length < 50 &&
          trimmed.match(
            /^(المقدمة|الملخص|منهجية|المنهجية|النتائج|الخاتمة|المراجع)/i
          )
        ) {
          return true;
        }

        return false;
      });

      if (isSection) {
        // إنشاء معرف فريد للقسم
        const sectionKey = trimmed
          .replace(/[:\-–—]/g, "")
          .trim()
          .toLowerCase();

        // منع التكرار - إذا كان القسم موجود بالفعل، لا نضيفه
        if (!seenSections.has(sectionKey)) {
          seenSections.add(sectionKey);
          const sectionId = `section-${index}-${trimmed
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")}`;
          sections.push({
            id: sectionId,
            title: trimmed, // العنوان فقط (سطر قصير)
            index: index,
          });
        }
      }
    });

    return sections;
  };

  // دالة للتمرير إلى قسم معين
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // إضافة/تحديث الأسماء فقط
  const handleAddNames = () => {
    if (!researchContent.trim()) {
      alert("لا يوجد بحث موجود. يرجى إنشاء بحث أولاً.");
      return;
    }

    if (!researcherName.trim() && !supervisorName.trim()) {
      alert("يرجى إدخال اسم الطالب أو المشرف");
      return;
    }

    let updatedContent = researchContent;

    // التحقق من وجود الأسماء في البداية
    const hasNamesAtStart =
      updatedContent.trim().startsWith("الطالب:") ||
      updatedContent.trim().startsWith("المشرف:");

    if (!hasNamesAtStart) {
      // إضافة الأسماء في البداية
      let namesSection = "";

      if (researcherName.trim() && supervisorName.trim()) {
        namesSection = `الطالب: ${researcherName.trim()}\nالمشرف: ${supervisorName.trim()}\n\n`;
      } else if (researcherName.trim()) {
        namesSection = `الطالب: ${researcherName.trim()}\n\n`;
      } else if (supervisorName.trim()) {
        namesSection = `المشرف: ${supervisorName.trim()}\n\n`;
      }

      if (namesSection) {
        updatedContent = namesSection + updatedContent;
      }
    } else {
      // تحديث الأسماء الموجودة
      if (researcherName.trim()) {
        updatedContent = updatedContent.replace(
          /الطالب:\s*[^\n]+/,
          `الطالب: ${researcherName.trim()}`
        );
      }
      if (supervisorName.trim()) {
        updatedContent = updatedContent.replace(
          /المشرف:\s*[^\n]+/,
          `المشرف: ${supervisorName.trim()}`
        );
      }
    }

    setResearchContent(updatedContent);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "تم إضافة/تحديث الأسماء بنجاح! ✅",
      },
    ]);
  };

  // إضافة محتوى جديد إلى البحث الموجود
  const handleAddToResearch = async () => {
    if (!researchTopic.trim()) {
      alert("يرجى إدخال موضوع البحث");
      return;
    }

    if (!researchContent.trim()) {
      alert("لا يوجد بحث موجود. يرجى إنشاء بحث أولاً.");
      return;
    }

    setLoading(true);

    try {
      // التحقق: إذا كان المستخدم أضاف فقط الأسماء ولم يكتب رسالة، نضيف الأسماء مباشرة
      const hasUserMessage =
        newContentInput.trim().length > 0 || chatMessage.trim().length > 0;
      const hasNewNames =
        (researcherName.trim() &&
          !researchContent.includes(`الطالب: ${researcherName.trim()}`)) ||
        (supervisorName.trim() &&
          !researchContent.includes(`المشرف: ${supervisorName.trim()}`));

      if (!hasUserMessage && hasNewNames) {
        // إضافة الأسماء فقط بدون استدعاء AI
        let updatedContent = researchContent;

        // التحقق من وجود الأسماء في البداية
        const hasNamesAtStart =
          updatedContent.trim().startsWith("الطالب:") ||
          updatedContent.trim().startsWith("المشرف:");

        if (!hasNamesAtStart) {
          let namesSection = "";

          if (researcherName.trim() && supervisorName.trim()) {
            namesSection = `الطالب: ${researcherName.trim()}\nالمشرف: ${supervisorName.trim()}\n\n`;
          } else if (researcherName.trim()) {
            namesSection = `الطالب: ${researcherName.trim()}\n\n`;
          } else if (supervisorName.trim()) {
            namesSection = `المشرف: ${supervisorName.trim()}\n\n`;
          }

          if (namesSection) {
            updatedContent = namesSection + updatedContent;
          }
        } else {
          // تحديث الأسماء الموجودة
          if (researcherName.trim()) {
            updatedContent = updatedContent.replace(
              /الطالب:\s*[^\n]+/,
              `الطالب: ${researcherName.trim()}`
            );
          }
          if (supervisorName.trim()) {
            updatedContent = updatedContent.replace(
              /المشرف:\s*[^\n]+/,
              `المشرف: ${supervisorName.trim()}`
            );
          }
        }

        setResearchContent(updatedContent);
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "تم إضافة/تحديث الأسماء بنجاح!" },
        ]);
        setLoading(false);
        return;
      }

      // استخدام حقل إدخال المحتوى الجديد أو رسالة المحادثة
      const userMessage =
        newContentInput.trim() ||
        chatMessage.trim() ||
        "يرجى إضافة محتوى جديد أو توسيع البحث الموجود";

      // بناء رسالة المحتوى مع القسم المحدد إن وجد
      let contentRequest = userMessage;
      if (newContentSection.trim()) {
        contentRequest = `أضف المحتوى التالي في قسم "${newContentSection}":\n\n${userMessage}`;
      }

      // استخدام رسالة محددة للـ AI لتعديل/إضافة المحتوى فقط وليس إعادة الإنشاء
      const editInstructions = `⚠️ مهم جداً: أنت تقوم بتعديل أو إضافة محتوى لبحث موجود. لا تعيد إنشاء البحث من جديد.

المحتوى الحالي للبحث:
${researchContent.substring(0, 3000)}${
        researchContent.length > 3000 ? "..." : ""
      }

المطلوب:
${contentRequest}

${
  researcherName.trim() || supervisorName.trim()
    ? `\nيرجى أيضاً إضافة الأسماء التالية في بداية البحث:\n${
        researcherName.trim() ? `الطالب: ${researcherName.trim()}` : ""
      }${researcherName.trim() && supervisorName.trim() ? "\n" : ""}${
        supervisorName.trim() ? `المشرف: ${supervisorName.trim()}` : ""
      }\n`
    : ""
}

قواعد مهمة:
- لا تعيد كتابة البحث من البداية
- أضف أو عدل فقط ما هو مطلوب
- احتفظ بجميع المحتوى الموجود
- إذا طُلب منك إضافة محتوى في قسم معين، أضفه في ذلك القسم المحدد
- إذا طُلب منك إضافة الأسماء، أضفها في بداية البحث فقط
- أعد المحتوى الكامل المحدث (القديم + الجديد) وليس فقط الجزء الجديد`;

      // استيراد chatCompletion مباشرة
      const { chatCompletion } = await import("../../services/ai");

      const messages = [
        {
          role: "system",
          content: `أنت مساعد ذكي يساعد في تعديل وإضافة محتوى لبحث علمي موجود. مهمتك هي:
- إضافة أو تعديل المحتوى المطلوب فقط
- عدم إعادة كتابة البحث من البداية
- الحفاظ على المحتوى الموجود
- إضافة الأسماء في بداية البحث إذا طُلب منك ذلك
- الرد بالعربية فقط`,
        },
        {
          role: "user",
          content: editInstructions,
        },
      ];

      const response = await chatCompletion(messages, {
        model: "openai/gpt-5-nano-2025-08-07",
        maxTokens: 4000,
        temperature: 0.7,
      });

      const newContent = response.choices?.[0]?.message?.content || "";

      if (!newContent) {
        alert("لم يتم العثور على محتوى في الاستجابة. يرجى المحاولة مرة أخرى.");
        return;
      }

      // إذا كانت الرسالة تتعلق بإضافة الأسماء فقط، ندمجها بشكل ذكي
      if (
        (userMessage.toLowerCase().includes("اسم") ||
          userMessage.toLowerCase().includes("الطالب") ||
          userMessage.toLowerCase().includes("المشرف")) &&
        !userMessage.toLowerCase().includes("محتوى") &&
        !userMessage.toLowerCase().includes("توسيع") &&
        !userMessage.toLowerCase().includes("أضف")
      ) {
        // إضافة الأسماء في البداية إذا لم تكن موجودة
        let finalContent = researchContent;
        const hasNamesAtStart =
          finalContent.trim().startsWith("الطالب:") ||
          finalContent.trim().startsWith("المشرف:");

        if (
          !hasNamesAtStart &&
          (researcherName.trim() || supervisorName.trim())
        ) {
          let namesSection = "";
          if (researcherName.trim() && supervisorName.trim()) {
            namesSection = `الطالب: ${researcherName.trim()}\nالمشرف: ${supervisorName.trim()}\n\n`;
          } else if (researcherName.trim()) {
            namesSection = `الطالب: ${researcherName.trim()}\n\n`;
          } else if (supervisorName.trim()) {
            namesSection = `المشرف: ${supervisorName.trim()}\n\n`;
          }
          finalContent = namesSection + finalContent;
        }

        setResearchContent(finalContent);
      } else {
        // دمج المحتوى الجديد مع القديم بشكل ذكي
        // إذا كان AI أعاد المحتوى الكامل، نستخدمه مباشرة
        // إذا كان المحتوى الجديد قصيراً، نضيفه في النهاية
        if (newContent.length > researchContent.length * 0.8) {
          // AI أعاد المحتوى الكامل المحدث
          setResearchContent(newContent);
        } else {
          // محتوى جديد قصير - نضيفه في النهاية
          setResearchContent((prev) => prev + "\n\n" + newContent);
        }
      }

      // مسح حقل الإدخال بعد الإضافة
      setNewContentInput("");
      setNewContentSection("");

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: contentRequest },
        { role: "assistant", content: "تم التعديل/الإضافة بنجاح! ✅" },
      ]);

      // Capture token usage if available
      if (response.usage) {
        setTokenUsage((prev) => {
          if (prev) {
            return {
              prompt_tokens:
                prev.prompt_tokens + (response.usage.prompt_tokens || 0),
              completion_tokens:
                prev.completion_tokens +
                (response.usage.completion_tokens || 0),
              total_tokens:
                prev.total_tokens + (response.usage.total_tokens || 0),
            };
          }
          return response.usage;
        });
      }
    } catch (error) {
      console.error("❌ Error adding to research:", error);
      alert(`حدث خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">العودة</span>
            </button>

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Page Title - Fade in */}
        <div className="fade-on-scroll mb-6 sm:mb-8 lg:mb-10 mt-2 sm:mt-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-2 sm:mb-4">
            إنشاء بحث علمي جديد
          </h1>
          <p className="text-gray-600 text-center text-sm sm:text-base lg:text-lg">
            خاصة لإعداد مخطط علمي دقيق وفقاً لأحدث التقنيات والمعايير
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Sidebar - Research Structure */}
          <div
            className={`lg:col-span-1 fade-on-scroll fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto transform transition-transform duration-300 ${
              mobileMenuOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl sm:rounded-3xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 shadow-lg h-full overflow-y-auto max-h-screen lg:max-h-none w-[85vw] sm:w-[70vw] lg:w-full max-w-[320px] sm:max-w-none">
              {/* Close Button for Mobile */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2
                  className="text-white font-bold text-xl sm:text-2xl flex items-center gap-2"
                  dir="rtl"
                >
                  <FileText size={24} className="sm:w-7 sm:h-7" />
                  هيكل البحث
                </h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Desktop Title */}
              <h2
                className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 hidden lg:flex items-center gap-3"
                dir="rtl"
              >
                <FileText size={28} />
                هيكل البحث
              </h2>
              <h2
                className="text-white font-bold text-2xl mb-6 flex items-center gap-3"
                dir="rtl"
              >
                <FileText size={28} />
                هيكل البحث
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {/* Display all sections in unified order */}
                {unifiedSectionOrder
                  .filter((unifiedKey) => {
                    if (unifiedKey.startsWith("standard:")) {
                      const key = unifiedKey.replace("standard:", "");
                      return !hiddenSections.includes(key);
                    }
                    return true;
                  })
                  .map((unifiedKey) => {
                    const filteredOrder = unifiedSectionOrder.filter((k) => {
                      if (k.startsWith("standard:")) {
                        const key = k.replace("standard:", "");
                        return !hiddenSections.includes(key);
                      }
                      return true;
                    });
                    const currentIndex = filteredOrder.indexOf(unifiedKey);

                    if (unifiedKey.startsWith("standard:")) {
                      const key = unifiedKey.replace("standard:", "");
                      const label = sectionLabels[key];
                      if (!label) return null;
                      return (
                        <div
                          key={unifiedKey}
                          className="w-full flex items-center gap-2"
                          dir="rtl"
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSectionUp(key, false);
                              }}
                              disabled={currentIndex === 0}
                              className="p-1 rounded cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="تحريك لأعلى"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSectionDown(key, false);
                              }}
                              disabled={
                                currentIndex === filteredOrder.length - 1
                              }
                              className="p-1 rounded cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="تحريك لأسفل"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleSectionToggle(key)}
                            className="flex-1 cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 group"
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
                                selectedSections[key]
                                  ? "text-white"
                                  : "text-white/80"
                              }`}
                            >
                              {label}
                            </span>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setHiddenSections((prev) => [...prev, key]);
                              }}
                              className="transition-all cursor-pointer text-white/70 hover:scale-110 p-1"
                            >
                              <X size={18} className="text-current" />
                            </div>
                          </button>
                        </div>
                      );
                    } else if (unifiedKey.startsWith("custom:")) {
                      const section = unifiedKey.replace("custom:", "");
                      const sectionIndex = customSections.findIndex(
                        (s) => s === section
                      );
                      if (sectionIndex === -1) return null;
                      return (
                        <div
                          key={unifiedKey}
                          className="w-full flex items-center gap-2"
                          dir="rtl"
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSectionUp(section, true);
                              }}
                              disabled={currentIndex === 0}
                              className="p-1 rounded cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="تحريك لأعلى"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSectionDown(section, true);
                              }}
                              disabled={
                                currentIndex === filteredOrder.length - 1
                              }
                              className="p-1 rounded cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="تحريك لأسفل"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleToggleCustomSection(section)}
                            className="flex-1 cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 group"
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
                                handleRemoveCustomSection(sectionIndex);
                              }}
                              className="transition-all cursor-pointer text-white/70 hover:scale-110 p-1"
                            >
                              <X size={18} className="text-current" />
                            </div>
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
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

              {/* Decoration and Frames Section */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <label
                  className="block text-white font-semibold text-base mb-4"
                  dir="rtl"
                >
                  <Palette size={18} className="inline ml-2" />
                  الزخارف والإطارات
                </label>

                {/* Decoration Style Selection */}
                <div className="mb-4">
                  <label
                    className="block text-white text-sm mb-3 font-medium"
                    dir="rtl"
                  >
                    نوع الزخرفة
                  </label>

                  {/* Word-like Professional Styles */}
                  <div>
                    <label
                      className="block text-white/80 text-xs mb-2"
                      dir="rtl"
                    >
                      قوالب Word الاحترافية
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {Object.entries(decorationStyles)
                        .filter(([key]) => key.startsWith("word"))
                        .map(([key, style]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedDecoration(key)}
                            className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer text-center ${
                              selectedDecoration === key
                                ? "border-amber-400 bg-amber-500/30 shadow-lg"
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                            dir="rtl"
                            title={style.name}
                          >
                            <div className="text-lg mb-1">{style.icon}</div>
                            <div
                              className={`text-xs font-semibold truncate ${
                                selectedDecoration === key
                                  ? "text-white"
                                  : "text-white/70"
                              }`}
                            >
                              {style.name}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Spacing Controls */}
                {selectedDecoration !== "none" && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
                    <label
                      className="block text-white text-sm mb-3 font-medium"
                      dir="rtl"
                    >
                      ضبط المسافات
                    </label>

                    {/* Padding Control */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-xs" dir="rtl">
                          المسافة الداخلية
                        </label>
                        <span className="text-white/80 text-xs font-mono">
                          {decorationSpacing.padding}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={decorationSpacing.padding}
                        onChange={(e) =>
                          setDecorationSpacing((prev) => ({
                            ...prev,
                            padding: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Margin Control */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-xs" dir="rtl">
                          المسافة الخارجية
                        </label>
                        <span className="text-white/80 text-xs font-mono">
                          {decorationSpacing.margin}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={decorationSpacing.margin}
                        onChange={(e) =>
                          setDecorationSpacing((prev) => ({
                            ...prev,
                            margin: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Border Width Control */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white text-xs" dir="rtl">
                          سماكة الإطار
                        </label>
                        <span className="text-white/80 text-xs font-mono">
                          {decorationSpacing.borderWidth}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={decorationSpacing.borderWidth}
                        onChange={(e) =>
                          setDecorationSpacing((prev) => ({
                            ...prev,
                            borderWidth: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                )}
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

                {/* Image Upload */}
                <div className="space-y-3 mt-4">
                  <label className="block text-white text-sm mb-2" dir="rtl">
                    <Upload size={16} className="inline ml-2" />
                    رفع صورة
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="block w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-dashed border-white/30 hover:bg-white/15 hover:border-white/50 transition-all cursor-pointer text-center"
                  >
                    <p className="text-white text-sm">
                      {uploadedImages.length > 0
                        ? `${uploadedImages.length} صورة مرفوعة`
                        : "اختر صورة أو أكثر"}
                    </p>
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadedImages.map((img) => (
                        <div
                          key={img.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20"
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="flex-1 text-white text-xs truncate">
                            {img.name}
                          </span>
                          <button
                            onClick={() => handleRemoveImage(img.id)}
                            className="p-1 cursor-pointer hover:bg-red-500/20 rounded transition-colors"
                          >
                            <X size={14} className="text-red-300" />
                          </button>
                        </div>
                      ))}
                    </div>
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

              {/* Reference Style Selector */}
              {references.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <label
                    className="block text-white font-semibold text-base mb-3"
                    dir="rtl"
                  >
                    <BookOpen size={18} className="inline ml-2" />
                    نظام المراجع
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "apa", label: "APA", icon: "📚" },
                      { id: "ieee", label: "IEEE", icon: "🔬" },
                      { id: "mla", label: "MLA", icon: "📖" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setReferenceStyle(style.id)}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer text-center ${
                          referenceStyle === style.id
                            ? "border-amber-400 bg-amber-500/30"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-lg mb-1">{style.icon}</div>
                        <div
                          className={`text-xs font-semibold ${
                            referenceStyle === style.id
                              ? "text-white"
                              : "text-white/70"
                          }`}
                        >
                          {style.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Input Card */}
            <div className="fade-on-scroll bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    className="block text-gray-800 font-bold mb-2 sm:mb-3 text-base sm:text-lg"
                    dir="rtl"
                  >
                    موضوع البحث <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="أدخل موضوع البحث..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-base sm:text-lg transition-all shadow-sm"
                    dir="rtl"
                    required
                    minLength={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base"
                      dir="rtl"
                    >
                      اسم الطالب
                    </label>
                    <input
                      type="text"
                      value={researcherName}
                      onChange={(e) => setResearcherName(e.target.value)}
                      placeholder="الاسم"
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm sm:text-base"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base"
                      dir="rtl"
                    >
                      اسم المشرف
                    </label>
                    <input
                      type="text"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value)}
                      placeholder="الاسم"
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm sm:text-base"
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
            <div className="fade-on-scroll bg-white rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 sm:px-6 py-3 sm:py-5">
                <div className="flex items-center gap-2 sm:gap-3 text-white">
                  <MessageCircle size={20} className="sm:w-6 sm:h-6" />
                  <h2 className="font-bold text-base sm:text-lg flex-1">
                    المحادثة التفاعلية
                  </h2>
                  <Bot size={20} className="opacity-80 sm:w-6 sm:h-6" />
                </div>
              </div>

              <div
                className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto bg-gray-50"
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

              <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 border-t border-gray-200 space-y-3 sm:space-y-5">
                <div className="flex gap-2 sm:gap-4">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 sm:focus:ring-4 focus:ring-amber-200 outline-none text-base sm:text-lg lg:text-xl transition-all bg-white shadow-sm font-medium"
                    dir="rtl"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !chatMessage.trim()}
                    className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    <Send size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Create New Research Button */}
                  <button
                    onClick={handleGenerateResearch}
                    disabled={loading || !researchTopic.trim()}
                    className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base sm:text-lg lg:text-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>جاري الإنشاء...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} />
                        <span>
                          {researchContent.trim()
                            ? "إنشاء بحث جديد"
                            : "إنشاء البحث"}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Add Content Section - Only show if research exists */}
                  {researchContent.trim() && (
                    <>
                      {/* Add New Content Input Section */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-blue-200 shadow-sm">
                        <h3
                          className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2"
                          dir="rtl"
                        >
                          <PlusCircle
                            size={18}
                            className="sm:w-5 sm:h-5 text-blue-600"
                          />
                          إضافة محتوى جديد للبحث
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          {/* Section Selector */}
                          <div>
                            <label
                              className="block text-gray-700 font-semibold mb-2 text-sm"
                              dir="rtl"
                            >
                              القسم المطلوب (اختياري)
                            </label>
                            <select
                              value={newContentSection}
                              onChange={(e) =>
                                setNewContentSection(e.target.value)
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
                              dir="rtl"
                            >
                              <option value="">
                                اختر القسم (أو اتركه فارغاً)
                              </option>
                              {unifiedSectionOrder
                                .filter((unifiedKey) => {
                                  if (unifiedKey.startsWith("standard:")) {
                                    const key = unifiedKey.replace(
                                      "standard:",
                                      ""
                                    );
                                    return sectionLabels[key];
                                  }
                                  return true;
                                })
                                .map((unifiedKey) => {
                                  if (unifiedKey.startsWith("standard:")) {
                                    const key = unifiedKey.replace(
                                      "standard:",
                                      ""
                                    );
                                    return (
                                      <option
                                        key={unifiedKey}
                                        value={sectionLabels[key]}
                                      >
                                        {sectionLabels[key]}
                                      </option>
                                    );
                                  } else {
                                    const section = unifiedKey.replace(
                                      "custom:",
                                      ""
                                    );
                                    return (
                                      <option key={unifiedKey} value={section}>
                                        {section}
                                      </option>
                                    );
                                  }
                                })}
                            </select>
                          </div>

                          {/* Content Input */}
                          <div>
                            <label
                              className="block text-gray-700 font-semibold mb-2 text-sm"
                              dir="rtl"
                            >
                              المحتوى المطلوب إضافته
                            </label>
                            <textarea
                              value={newContentInput}
                              onChange={(e) =>
                                setNewContentInput(e.target.value)
                              }
                              placeholder="اكتب المحتوى الذي تريد إضافته للبحث... (مثال: أضف معلومات عن الذكاء الاصطناعي في قسم المقدمة)"
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm min-h-[100px] resize-y"
                              dir="rtl"
                              disabled={loading}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 sm:gap-3">
                            <button
                              onClick={handleAddToResearch}
                              disabled={
                                loading ||
                                !researchTopic.trim() ||
                                (!newContentInput.trim() && !chatMessage.trim())
                              }
                              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="animate-spin" size={18} />
                                  <span>جاري الإضافة...</span>
                                </>
                              ) : (
                                <>
                                  <PlusCircle size={18} />
                                  <span>إضافة المحتوى</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setNewContentInput("");
                                setNewContentSection("");
                              }}
                              disabled={loading}
                              className="px-6 py-3 cursor-pointer rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all disabled:opacity-50"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Add/Update Names Button */}
                      {(researcherName.trim() || supervisorName.trim()) && (
                        <button
                          onClick={handleAddNames}
                          disabled={loading}
                          className="w-full px-8 py-4 cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          <User size={20} />
                          <span>إضافة/تحديث الأسماء</span>
                        </button>
                      )}

                      {/* Formatting Notice */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p
                          className="text-sm text-amber-800 text-center"
                          dir="rtl"
                        >
                          💡 <strong>ملاحظة:</strong> التعديلات على القوالب،
                          الخطوط، الألوان، والزخارف تطبق تلقائياً على البحث
                          الموجود
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Research Output */}
            {researchContent && (
              <div className="fade-on-scroll bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 flex-1">
                    محتوى البحث
                  </h2>
                  <button
                    onClick={async (event) => {
                      const button = event.currentTarget;
                      const originalText = button.innerHTML;

                      try {
                        // تعطيل الزر مؤقتاً
                        button.disabled = true;
                        button.innerHTML =
                          '<Loader2 className="animate-spin" size={20} /> جاري التحضير...';

                        // استخدام setTimeout لإعطاء المتصفح فرصة لتحديث الواجهة
                        await new Promise((resolve) =>
                          setTimeout(resolve, 100)
                        );

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
                            a {
                              color: ${titleColor};
                              text-decoration: none;
                            }
                            a:hover {
                              text-decoration: underline;
                              color: #3b82f6;
                            }
                            .toc {
                              background: linear-gradient(to bottom, #eff6ff, #dbeafe);
                              border: 2px solid #93c5fd;
                              border-radius: 12px;
                              padding: 20px;
                              margin-bottom: 30px;
                            }
                            .toc h2 {
                              color: ${titleColor};
                              font-size: 1.5em;
                              margin-bottom: 15px;
                              padding-bottom: 10px;
                              border-bottom: 2px solid #93c5fd;
                            }
                            .toc ul {
                              list-style: none;
                              padding: 0;
                              margin: 0;
                            }
                            .toc li {
                              margin: 12px 0;
                              padding: 8px 0;
                              display: flex;
                              align-items: start;
                              gap: 8px;
                            }
                            .toc li::before {
                              content: "•";
                              color: #2563eb;
                              font-weight: bold;
                              font-size: 1.2em;
                              margin-left: 8px;
                            }
                            .toc a {
                              color: ${contentColor};
                              font-size: 1.1em;
                              padding: 8px 12px;
                              display: block;
                              border-radius: 6px;
                              transition: all 0.2s;
                              text-decoration: underline;
                              text-decoration-color: rgba(59, 130, 246, 0.3);
                              text-underline-offset: 4px;
                              cursor: pointer;
                              flex: 1;
                              text-align: right;
                            }
                            .toc a:hover {
                              background: #dbeafe;
                              color: #1e40af;
                              text-decoration-color: #2563eb;
                              border-bottom: 2px solid #2563eb;
                            }
                          </style>
                        </head>
                        <body>
                          ${(() => {
                            // استخراج الأقسام للملف المُصدّر
                            const sections = [];
                            const lines = researchContent.split("\n");
                            const allSectionNames = [
                              ...Object.values(sectionLabels),
                              ...customSections,
                              researchTopic,
                            ];

                            const seenSections = new Set();

                            lines.forEach((line, index) => {
                              const trimmed = line.trim();
                              if (!trimmed) return;

                              // استبعاد الفهرس نفسه من القائمة
                              if (
                                trimmed.includes("فهرس المحتوى") ||
                                trimmed.match(/^فهرس/i)
                              ) {
                                return;
                              }

                              const normalizedTitle = trimmed
                                .replace(/[:\-–—]/g, "")
                                .trim()
                                .toLowerCase();

                              const isSection = allSectionNames.some(
                                (sectionName) => {
                                  const normalizedLine = trimmed
                                    .replace(/[:\-–—]/g, "")
                                    .trim();
                                  const normalizedSection = sectionName
                                    .replace(/[:\-–—]/g, "")
                                    .trim();
                                  return (
                                    normalizedLine === normalizedSection ||
                                    (trimmed.length < 100 &&
                                      trimmed.match(
                                        /^(المقدمة|الملخص|منهجية|المنهجية|النتائج|الخاتمة|المراجع)/i
                                      ))
                                  );
                                }
                              );

                              if (isSection) {
                                // منع التكرار
                                if (!seenSections.has(normalizedTitle)) {
                                  seenSections.add(normalizedTitle);
                                  const sectionId = `section-${index}-${trimmed
                                    .replace(/\s+/g, "-")
                                    .replace(/[^\w-]/g, "")}`;
                                  sections.push({
                                    id: sectionId,
                                    title: trimmed,
                                  });
                                }
                              }
                            });

                            if (sections.length > 0) {
                              return `<div class="toc">
                                  <h2>📑 فهرس المحتوى</h2>
                                  <ul>
                                    ${sections
                                      .map(
                                        (section) =>
                                          `<li><a href="#${section.id}" style="text-decoration: underline; text-decoration-color: rgba(59, 130, 246, 0.3); text-underline-offset: 4px; cursor: pointer;">${section.title}</a></li>`
                                      )
                                      .join("")}
                                  </ul>
                                </div>`;
                            }
                            return "";
                          })()}
                          ${
                            uploadedImages.length > 0
                              ? `<div style="margin-bottom: 30px;">
                                  <h2 style="color: ${titleColor}; font-size: 1.5em; margin-bottom: 15px;">الصور المرفوعة</h2>
                                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                    ${uploadedImages
                                      .map(
                                        (img) =>
                                          `<img src="${img.url}" alt="${img.name}" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;" />`
                                      )
                                      .join("")}
                                  </div>
                                </div>`
                              : ""
                          }
                          <div style="
                            ${
                              selectedDecoration !== "none"
                                ? `background: ${
                                    decorationStyles[selectedDecoration]
                                      .background || "transparent"
                                  };`
                                : ""
                            }
                            border-width: ${
                              selectedDecoration !== "none"
                                ? `${decorationSpacing.borderWidth}px`
                                : "0px"
                            };
                            border-style: ${
                              selectedDecoration !== "none"
                                ? decorationStyles[selectedDecoration]
                                    .borderStyle || "solid"
                                : "none"
                            };
                            border-color: ${
                              selectedDecoration !== "none"
                                ? decorationStyles[selectedDecoration]
                                    .borderColor || "#d1d5db"
                                : "transparent"
                            };
                            box-shadow: ${
                              selectedDecoration !== "none"
                                ? decorationStyles[selectedDecoration]
                                    .boxShadow || "none"
                                : "none"
                            };
                            padding: ${decorationSpacing.padding}px;
                            margin: ${decorationSpacing.margin}px;
                            border-radius: 12px;
                          ">
                            ${(() => {
                              const seenSections = new Set();
                              const allSectionNames = [
                                ...Object.values(sectionLabels),
                                ...customSections,
                                researchTopic,
                              ];

                              return researchContent
                                .split("\n")
                                .map((line, index) => {
                                  const trimmed = line.trim();
                                  if (!trimmed) return "<br>";

                                  // استبعاد الفهرس من المحتوى
                                  if (
                                    trimmed.includes("فهرس المحتوى") ||
                                    trimmed.match(/^فهرس/i)
                                  ) {
                                    return "";
                                  }

                                  // Detect headers - lines that are short and likely titles
                                  const normalizedTitle = trimmed
                                    .replace(/[:\-–—]/g, "")
                                    .trim()
                                    .toLowerCase();

                                  const isSection = allSectionNames.some(
                                    (sectionName) => {
                                      const normalizedLine = trimmed
                                        .replace(/[:\-–—]/g, "")
                                        .trim()
                                        .toLowerCase();
                                      const normalizedSection = sectionName
                                        .replace(/[:\-–—]/g, "")
                                        .trim()
                                        .toLowerCase();

                                      // مطابقة مباشرة
                                      if (normalizedLine === normalizedSection)
                                        return true;

                                      // مطابقة جزئية (للأقسام المخصصة)
                                      if (
                                        normalizedLine.includes(
                                          normalizedSection
                                        ) ||
                                        normalizedSection.includes(
                                          normalizedLine
                                        )
                                      ) {
                                        return true;
                                      }

                                      // للأنماط القياسية
                                      if (
                                        trimmed.length < 100 &&
                                        trimmed.match(
                                          /^(المقدمة|الملخص|منهجية|المنهجية|النتائج|الخاتمة|المراجع)/i
                                        )
                                      ) {
                                        return true;
                                      }

                                      return false;
                                    }
                                  );

                                  if (isSection) {
                                    // منع تكرار الأقسام
                                    if (seenSections.has(normalizedTitle)) {
                                      return ""; // لا نعرض القسم المكرر
                                    }
                                    seenSections.add(normalizedTitle);

                                    const sectionId = `section-${index}-${trimmed
                                      .replace(/\s+/g, "-")
                                      .replace(/[^\w-]/g, "")}`;
                                    return `<h2 id="${sectionId}">${trimmed}</h2>`;
                                  }
                                  return `<p>${trimmed}</p>`;
                                })
                                .filter((line) => line !== "")
                                .join("\n");
                            })()}
                            ${
                              references.length > 0
                                ? `<div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                                    <h2 style="color: ${titleColor}; font-size: 2em; margin-bottom: 20px; font-weight: 700;">المراجع</h2>
                                    <div style="space-y: 16px;" dir="rtl">
                                      ${references
                                        .map((ref, index) => {
                                          const url = ref.url;
                                          let formattedRef = "";

                                          if (referenceStyle === "apa") {
                                            const currentDate = new Date();
                                            const year =
                                              currentDate.getFullYear();
                                            const monthNames = {
                                              January: "يناير",
                                              February: "فبراير",
                                              March: "مارس",
                                              April: "أبريل",
                                              May: "مايو",
                                              June: "يونيو",
                                              July: "يوليو",
                                              August: "أغسطس",
                                              September: "سبتمبر",
                                              October: "أكتوبر",
                                              November: "نوفمبر",
                                              December: "ديسمبر",
                                            };
                                            const month =
                                              monthNames[
                                                currentDate.toLocaleDateString(
                                                  "en-US",
                                                  { month: "long" }
                                                )
                                              ] ||
                                              currentDate.toLocaleDateString(
                                                "ar-SA",
                                                { month: "long" }
                                              );
                                            const day = currentDate.getDate();

                                            let websiteName = "";
                                            try {
                                              const urlObj = new URL(url);
                                              websiteName = urlObj.hostname
                                                .replace("www.", "")
                                                .split(".")[0];
                                              websiteName =
                                                websiteName
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                websiteName.slice(1);
                                            } catch {
                                              websiteName = "موقع إلكتروني";
                                            }

                                            formattedRef = `${
                                              index + 1
                                            }. المرجع الإلكتروني. (${year}، ${month} ${day}). ${websiteName}. تم الاسترجاع من <a href="${url}" style="color: ${titleColor}; text-decoration: underline;">${url}</a>`;
                                          } else if (
                                            referenceStyle === "ieee"
                                          ) {
                                            formattedRef = `[${
                                              index + 1
                                            }] المرجع الإلكتروني، "${url}،" ${new Date().getFullYear()}. [Online]. Available: <a href="${url}" style="color: ${titleColor}; text-decoration: underline;">${url}</a>`;
                                          } else if (referenceStyle === "mla") {
                                            formattedRef = `${
                                              index + 1
                                            }. المرجع الإلكتروني. ${new Date().toLocaleDateString(
                                              "ar-SA"
                                            )}. <a href="${url}" style="color: ${titleColor}; text-decoration: underline;">${url}</a>`;
                                          }

                                          return `<p style="margin: 12px 0; padding: 12px; background: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 1.1em; line-height: 1.8;">${formattedRef}</p>`;
                                        })
                                        .join("")}
                                    </div>
                                  </div>`
                                : ""
                            }
                          </div>
                        </body>
                        </html>
                      `;

                        // Handle different export formats
                        if (exportFormat === "pdf") {
                          // Create a new window with the content and trigger print
                          const printWindow = window.open("", "_blank");
                          if (printWindow) {
                            printWindow.document.write(styledContent);
                            printWindow.document.close();
                            printWindow.focus();
                            setTimeout(() => {
                              printWindow.print();
                            }, 500);
                          }
                        } else if (exportFormat === "html") {
                          // Download as HTML
                          const blob = new Blob([styledContent], {
                            type: "text/html",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${researchTopic || "بحث علمي"}.html`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          setTimeout(() => URL.revokeObjectURL(url), 100);
                        } else if (exportFormat === "docx") {
                          alert(
                            "تحويل Word قريباً! حالياً يمكنك تحميل HTML ثم فتحه في Word."
                          );
                        } else if (exportFormat === "pptx") {
                          alert(
                            "تحويل PowerPoint قريباً! حالياً يمكنك تحميل HTML أو PDF."
                          );
                        }
                      } catch (error) {
                        console.error("Error exporting:", error);
                        alert(`حدث خطأ أثناء التصدير: ${error.message}`);
                      } finally {
                        // إعادة تفعيل الزر
                        button.disabled = false;
                        button.innerHTML = originalText;
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
                      background:
                        selectedDecoration !== "none"
                          ? decorationStyles[selectedDecoration].background ||
                            currentTemplateStyle.background
                          : currentTemplateStyle.background,
                      borderWidth:
                        selectedDecoration !== "none"
                          ? `${decorationSpacing.borderWidth}px`
                          : decorationStyles[selectedDecoration]?.borderWidth ||
                            "2px",
                      borderStyle:
                        selectedDecoration !== "none"
                          ? decorationStyles[selectedDecoration].borderStyle ||
                            "solid"
                          : "solid",
                      borderColor:
                        selectedDecoration !== "none"
                          ? decorationStyles[selectedDecoration].borderColor ||
                            currentTemplateStyle.borderColor
                          : currentTemplateStyle.borderColor,
                      boxShadow:
                        selectedDecoration !== "none"
                          ? decorationStyles[selectedDecoration].boxShadow ||
                            "none"
                          : "none",
                      padding: `${decorationSpacing.padding}px`,
                      margin: `${decorationSpacing.margin}px`,
                    }}
                  >
                    {/* Display Table of Contents */}
                    {(() => {
                      const sections = extractSections(researchContent);
                      if (sections.length > 0) {
                        return (
                          <div
                            id="table-of-contents"
                            className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm"
                          >
                            <h2
                              className="text-2xl font-bold mb-4 pb-3 border-b-2 border-blue-300"
                              style={{ color: titleColor }}
                            >
                              📑 فهرس المحتوى
                            </h2>
                            <ul
                              className="space-y-3 list-none p-0 m-0"
                              dir="rtl"
                            >
                              {sections.map((section) => (
                                <li
                                  key={section.id}
                                  className="flex items-start"
                                >
                                  <span className="text-blue-600 font-bold ml-2 mt-1">
                                    •
                                  </span>
                                  <button
                                    onClick={() => scrollToSection(section.id)}
                                    className="flex-1 text-right hover:text-blue-600 transition-all duration-200 font-medium text-base py-2 px-3 rounded-lg hover:bg-blue-50 cursor-pointer border-b-2 border-transparent hover:border-blue-400"
                                    style={{
                                      color: contentColor,
                                      textDecoration: "underline",
                                      textDecorationColor:
                                        "rgba(59, 130, 246, 0.3)",
                                      textUnderlineOffset: "4px",
                                    }}
                                  >
                                    {section.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Display Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="mb-6 space-y-4">
                        <h3
                          className="text-lg font-bold mb-3"
                          style={{ color: titleColor }}
                        >
                          الصور المرفوعة
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uploadedImages.map((img) => (
                            <div
                              key={img.id}
                              className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
                            >
                              <img
                                src={img.url}
                                alt={img.name}
                                className="w-full h-auto object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {img.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(() => {
                      console.log(
                        "🎨 Rendering research content. Length:",
                        researchContent.length
                      );

                      // Create pattern for all section names (standard + custom)
                      const allSectionNames = [
                        ...Object.values(sectionLabels),
                        ...customSections,
                      ];
                      const sectionPattern = new RegExp(
                        `^(${allSectionNames.join("|")})`,
                        "i"
                      );

                      const seenSections = new Set(); // لمنع تكرار الأقسام

                      return researchContent
                        .split("\n")
                        .map((line, index) => {
                          const trimmed = line.trim();
                          if (!trimmed) return <br key={index} />;

                          // استبعاد الفهرس من المحتوى
                          if (
                            trimmed.includes("فهرس المحتوى") ||
                            trimmed.match(/^فهرس/i)
                          ) {
                            return null;
                          }

                          // Detect if line is a title/header
                          const normalizedTitle = trimmed
                            .replace(/[:\-–—]/g, "")
                            .trim()
                            .toLowerCase();

                          // التحقق من الأقسام المخصصة أيضاً
                          const matchesCustomSection = customSections.some(
                            (customSection) => {
                              const normalizedCustom = customSection
                                .replace(/[:\-–—]/g, "")
                                .trim()
                                .toLowerCase();
                              return (
                                normalizedTitle === normalizedCustom ||
                                normalizedTitle.includes(normalizedCustom) ||
                                normalizedCustom.includes(normalizedTitle)
                              );
                            }
                          );

                          const isTitle =
                            trimmed.length < 100 &&
                            (trimmed.includes(":") ||
                              sectionPattern.test(trimmed) ||
                              matchesCustomSection ||
                              trimmed === researchTopic ||
                              (index < 3 && trimmed.length < 50));

                          if (isTitle) {
                            // منع تكرار الأقسام
                            if (seenSections.has(normalizedTitle)) {
                              return null; // لا نعرض القسم المكرر
                            }
                            seenSections.add(normalizedTitle);

                            // إنشاء معرف فريد للقسم
                            const sectionId = `section-${index}-${trimmed
                              .replace(/\s+/g, "-")
                              .replace(/[^\w-]/g, "")}`;

                            return (
                              <h2
                                key={index}
                                id={sectionId}
                                style={{
                                  color: titleColor,
                                  fontWeight: 700,
                                  fontSize: currentTemplateStyle.titleSize,
                                  marginTop: currentTemplateStyle.titleSpacing,
                                  marginBottom: "12px",
                                  lineHeight: "1.4",
                                  scrollMarginTop: "80px", // مسافة عند التمرير
                                }}
                                className="scroll-mt-20"
                              >
                                {trimmed}
                              </h2>
                            );
                          }

                          return (
                            <p
                              key={index}
                              style={{
                                color: contentColor,
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
                        })
                        .filter(Boolean); // إزالة العناصر null
                    })()}

                    {/* Display References */}
                    {references.length > 0 && (
                      <div className="mt-8 pt-8 border-t-2 border-gray-300">
                        <h2
                          className="text-2xl font-bold mb-6"
                          style={{ color: titleColor }}
                        >
                          المراجع
                        </h2>
                        <div className="space-y-4" dir="rtl">
                          {references.map((ref, index) => {
                            let formattedRef = "";
                            const url = ref.url;

                            if (referenceStyle === "apa") {
                              // تنسيق APA للمراجع الإلكترونية: Author, A. A. (Year, Month Day). Title. Website Name. URL
                              const currentDate = new Date();
                              const year = currentDate.getFullYear();
                              const monthNames = {
                                January: "يناير",
                                February: "فبراير",
                                March: "مارس",
                                April: "أبريل",
                                May: "مايو",
                                June: "يونيو",
                                July: "يوليو",
                                August: "أغسطس",
                                September: "سبتمبر",
                                October: "أكتوبر",
                                November: "نوفمبر",
                                December: "ديسمبر",
                              };
                              const month =
                                monthNames[
                                  currentDate.toLocaleDateString("en-US", {
                                    month: "long",
                                  })
                                ] ||
                                currentDate.toLocaleDateString("ar-SA", {
                                  month: "long",
                                });
                              const day = currentDate.getDate();

                              // استخراج اسم الموقع من URL
                              let websiteName = "";
                              try {
                                const urlObj = new URL(url);
                                websiteName = urlObj.hostname
                                  .replace("www.", "")
                                  .split(".")[0];
                                // تحويل أول حرف إلى كبير
                                websiteName =
                                  websiteName.charAt(0).toUpperCase() +
                                  websiteName.slice(1);
                              } catch {
                                websiteName = "موقع إلكتروني";
                              }

                              formattedRef = `${
                                index + 1
                              }. المرجع الإلكتروني. (${year}، ${month} ${day}). ${websiteName}. تم الاسترجاع من `;
                            } else if (referenceStyle === "ieee") {
                              formattedRef = `[${
                                index + 1
                              }] المرجع الإلكتروني، "${url}،" ${new Date().getFullYear()}. [Online]. Available: `;
                            } else if (referenceStyle === "mla") {
                              formattedRef = `${
                                index + 1
                              }. المرجع الإلكتروني. ${new Date().toLocaleDateString(
                                "ar-SA"
                              )}. `;
                            }

                            return (
                              <div
                                key={ref.id}
                                className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                              >
                                <p
                                  style={{
                                    color: contentColor,
                                    fontSize: currentTemplateStyle.contentSize,
                                    lineHeight: currentTemplateStyle.lineHeight,
                                  }}
                                >
                                  {formattedRef}
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                    dir="ltr"
                                  >
                                    {url}
                                  </a>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
