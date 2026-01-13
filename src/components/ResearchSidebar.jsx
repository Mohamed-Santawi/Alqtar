import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  PlusCircle,
  X,
  Palette,
  BookOpen,
  FileDown,
  Upload,
  LinkIcon,
  Search,
  History,
} from "lucide-react";

// Accordion Section Component (moved outside to prevent re-renders)
const AccordionSection = ({
  title,
  icon: Icon,
  expanded,
  onToggle,
  children,
}) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-blue-600" />
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {expanded ? (
        <ChevronUp size={20} className="text-gray-400" />
      ) : (
        <ChevronDown size={20} className="text-gray-400" />
      )}
    </button>
    {expanded && (
      <div className="p-4 pt-0 space-y-4 animate-fade-in">{children}</div>
    )}
  </div>
);

/**
 * ResearchSidebar Component
 * A clean, collapsible sidebar for research configuration
 *
 * Props:
 * - selectedSections: object of standard sections state
 * - onSectionToggle: function to toggle standard sections
 * - customSections: array of custom section names
 * - selectedCustomSections: object of custom sections state
 * - onCustomSectionToggle: function to toggle custom sections
 * - onAddCustomSection: function to add new custom section
 * - onRemoveCustomSection: function to remove custom section
 * - unifiedSectionOrder: array of section order (standard:key or custom:name format)
 * - onMoveSectionUp: function to move section up
 * - onMoveSectionDown: function to move section down
 * - onRemoveStandardSection: function to remove standard section
 * - pageCount: desired number of pages for research
 * - onPageCountChange: function to change page count
 * - fontFamily: current font family
 * - onFontChange: function to change font
 * - titleColor: current title color
 * - onTitleColorChange: function to change title color
 * - contentColor: current content color
 * - onContentColorChange: function to change content color
 * - selectedDecoration: current decoration style
 * - onDecorationChange: function to change decoration
 * - exportFormat: current export format
 * - onExportFormatChange: function to change export format
 * - references: array of reference objects
 * - onAddReference: function to add reference
 * - onRemoveReference: function to remove reference
 * - uploadedFile: current uploaded file
 * - onFileUpload: function to handle file upload
 * - onRemoveFile: function to remove uploaded file
 * - uploadedImages: array of uploaded images for AI analysis
 * - onAddImages: function to add images
 * - onRemoveImage: function to remove an image
 * - decorationStyles: object of available decoration styles
 * - mobileMenuOpen: boolean for mobile menu state
 * - onCloseMobile: function to close mobile menu
 */

export default function ResearchSidebar({
  // Section management
  selectedSections = {},
  onSectionToggle,
  customSections = [],
  selectedCustomSections = {},
  onCustomSectionToggle,
  onAddCustomSection,
  onRemoveCustomSection,
  unifiedSectionOrder = [],
  onMoveSectionUp,
  onMoveSectionDown,
  onRemoveStandardSection,

  // Page count
  pageCount = 10,
  onPageCountChange,

  // Auto-generate images
  autoGenerateImages = false,
  onAutoGenerateImagesChange,

  // Customization
  fontFamily = "Cairo",
  onFontChange,
  titleColor = "#000000",
  onTitleColorChange,
  contentColor = "#333333",
  onContentColorChange,
  selectedDecoration = "none",
  onDecorationChange,

  // Export
  exportFormat = "pdf",
  onExportFormatChange,

  // References
  references = [],
  onAddReference,
  onRemoveReference,

  // File upload
  uploadedFile = null,
  onFileUpload,
  onRemoveFile,

  // Image upload for AI analysis
  uploadedImages = [],
  onAddImages,
  onRemoveImage,
  isAnalyzingImages = false,
  onAnalyzeImages,

  // Styles and config
  decorationStyles = {},

  // Typography
  titleFontSize = 24,
  onTitleFontSizeChange,
  contentFontSize = 16,
  onContentFontSizeChange,
  titleFontWeight = "bold",
  onTitleFontWeightChange,
  contentFontWeight = "normal",
  onContentFontWeightChange,

  // Custom Sections
  onClearAllCustomSections,

  // Mobile
  mobileMenuOpen = false,
  onCloseMobile,

  // History
  researches = [],
  onLoadResearch,
}) {
  // Internal state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    structure: true,
    history: true, // Show history by default if available
    customization: false,
    references: false,
    export: false,
  });

  const [newSectionInput, setNewSectionInput] = useState("");
  const [linkInput, setLinkInput] = useState("");

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Standard sections configuration
  const sectionLabels = {
    introduction: "المقدمة",
    tableOfContents: "فهرس المحتوى",
    abstract: "الملخص",
    methodology: "منهجية المحتوى",
    results: "النتائج",
    conclusion: "الخاتمة",
    references: "المراجع",
  };

  // Font families
  const fontFamilies = [
    { value: "Cairo", label: "Cairo" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Amiri", label: "Amiri" },
    { value: "Tajawal", label: "Tajawal" },
    { value: "Noto Sans Arabic", label: "Noto Sans Arabic" },
  ];

  // Color presets
  const titleColorPresets = [
    "#000000",
    "#1e40af",
    "#059669",
    "#dc2626",
    "#7c2d12",
    "#7c3aed",
    "#ea580c",
    "#0891b2",
  ];

  const contentColorPresets = [
    "#000000",
    "#333333",
    "#666666",
    "#1a1a1a",
    "#0d47a1",
    "#1b5e20",
    "#b71c1c",
    "#4a148c",
  ];

  // Handle add custom section
  const handleAddCustomSection = () => {
    console.log("🔵 ResearchSidebar: handleAddCustomSection called");
    console.log("🔵 Input value:", newSectionInput);
    console.log("🔵 Input trimmed:", newSectionInput.trim());

    if (newSectionInput.trim()) {
      console.log(
        "✅ Calling onAddCustomSection with:",
        newSectionInput.trim()
      );
      onAddCustomSection?.(newSectionInput.trim());
      setNewSectionInput("");
    } else {
      console.log("❌ Input is empty, not calling onAddCustomSection");
    }
  };

  // Handle add reference
  const handleAddLink = () => {
    if (linkInput.trim()) {
      onAddReference?.(linkInput.trim());
      setLinkInput("");
    }
  };

  return (
    <div
      className={`lg:col-span-1 fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto transform transition-transform duration-300 ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-lg h-full overflow-y-auto max-h-screen lg:max-h-none w-[85vw] sm:w-[70vw] lg:w-full max-w-[380px] sm:max-w-none border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold text-gray-800 flex items-center gap-2"
              dir="rtl"
            >
              <FileText size={24} className="text-blue-600" />
              إعدادات البحث
            </h2>
            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="divide-y divide-gray-200">
          {/* Recent Researches Section */}
          {researches.length > 0 && (
            <AccordionSection
              title="أبحاثك السابقة"
              icon={History}
              expanded={expandedSections.history}
              onToggle={() => toggleSection("history")}
            >
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {researches.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => onLoadResearch?.(res)}
                    className="w-full text-right p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all group flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-blue-300">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600">
                        {res.topic || "بدون عنوان"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {res.timestamp
                          ? new Date(res.timestamp).toLocaleDateString("ar-SA")
                          : "تاريخ غير معروف"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Research Structure Section */}
          <AccordionSection
            title="هيكل البحث"
            icon={FileText}
            expanded={expandedSections.structure}
            onToggle={() => toggleSection("structure")}
          >
            {/* All Sections - Unified Display */}
            <div className="space-y-2">
              {unifiedSectionOrder.map((unifiedKey) => {
                // Check if it's a standard section
                if (unifiedKey.startsWith("standard:")) {
                  const key = unifiedKey.replace("standard:", "");
                  const label = sectionLabels[key];
                  if (!label) return null;

                  const currentIndex = unifiedSectionOrder.indexOf(unifiedKey);
                  const isFirst = currentIndex === 0;
                  const isLast =
                    currentIndex === unifiedSectionOrder.length - 1;

                  return (
                    <div key={unifiedKey} className="flex items-center gap-2">
                      {/* Up/Down arrows */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSectionUp?.(key, false);
                          }}
                          disabled={isFirst}
                          className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSectionDown?.(key, false);
                          }}
                          disabled={isLast}
                          className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => onSectionToggle?.(key)}
                        className="flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                        dir="rtl"
                      >
                        {selectedSections[key] ? (
                          <CheckSquare
                            size={20}
                            className="text-blue-600 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <Square
                            size={20}
                            className="text-gray-400 group-hover:scale-110 transition-transform"
                          />
                        )}
                        <span
                          className={`flex-1 text-right ${
                            selectedSections[key]
                              ? "font-semibold text-gray-800"
                              : "text-gray-600"
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                      <button
                        onClick={() => onRemoveStandardSection?.(key)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="حذف القسم"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  );
                }

                // Check if it's a custom section
                if (unifiedKey.startsWith("custom:")) {
                  const section = unifiedKey.replace("custom:", "");
                  const index = customSections.indexOf(section);
                  if (index === -1) return null;

                  const currentIndex = unifiedSectionOrder.indexOf(unifiedKey);
                  const isFirst = currentIndex === 0;
                  const isLast =
                    currentIndex === unifiedSectionOrder.length - 1;

                  return (
                    <div key={unifiedKey} className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSectionUp?.(section, true);
                          }}
                          disabled={isFirst}
                          className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSectionDown?.(section, true);
                          }}
                          disabled={isLast}
                          className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => onCustomSectionToggle?.(section)}
                        className="flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                        dir="rtl"
                      >
                        {selectedCustomSections[section] ? (
                          <CheckSquare
                            size={20}
                            className="text-blue-600 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <Square
                            size={20}
                            className="text-gray-400 group-hover:scale-110 transition-transform"
                          />
                        )}
                        <span
                          className={`flex-1 text-right ${
                            selectedCustomSections[section]
                              ? "font-semibold text-gray-800"
                              : "text-gray-600"
                          }`}
                        >
                          {section}
                        </span>
                      </button>
                      <button
                        onClick={() => onRemoveCustomSection?.(index)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Add Custom Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  dir="rtl"
                >
                  إضافة قسم مخصص
                </label>
                {unifiedSectionOrder.some((key) =>
                  key.startsWith("custom:")
                ) && (
                  <button
                    onClick={onClearAllCustomSections}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold border border-red-100 bg-red-50 px-2 py-0.5 rounded-md transition-colors"
                  >
                    مسح جميع المخصص
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSectionInput}
                  onChange={(e) => setNewSectionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSection();
                    }
                  }}
                  placeholder="اسم القسم..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  dir="rtl"
                />
                <button
                  onClick={handleAddCustomSection}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>

            {/* Page Count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                عدد الصفحات المطلوبة
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={pageCount}
                onChange={(e) =>
                  onPageCountChange?.(parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                dir="rtl"
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1" dir="rtl">
                سيحاول الذكاء الاصطناعي إنشاء بحث بالطول المحدد
              </p>
            </div>

            {/* Auto-Generate Images */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={autoGenerateImages || false}
                  onChange={(e) =>
                    onAutoGenerateImagesChange?.(e.target.checked)
                  }
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span
                    className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors"
                    dir="rtl"
                  >
                    🎨 إضافة صور توضيحية تلقائياً
                  </span>
                  <p className="text-xs text-gray-500 mt-1" dir="rtl">
                    سيقوم الذكاء الاصطناعي بإنشاء صور توضيحية مناسبة للبحث
                  </p>
                </div>
              </label>
            </div>
          </AccordionSection>

          {/* Customization Section */}
          <AccordionSection
            title="التخصيص"
            icon={Palette}
            expanded={expandedSections.customization}
            onToggle={() => toggleSection("customization")}
          >
            {/* Font Family */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                نوع الخط
              </label>
              <select
                value={fontFamily}
                onChange={(e) => onFontChange?.(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                dir="rtl"
                style={{ fontFamily }}
              >
                {fontFamilies.map((font) => (
                  <option
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Color */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                لون العناوين
              </label>
              <input
                type="text"
                value={titleColor}
                onChange={(e) => onTitleColorChange?.(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                dir="ltr"
              />
              <div className="grid grid-cols-8 gap-2 mt-2">
                {titleColorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => onTitleColorChange?.(color)}
                    className="w-full h-8 rounded border-2 border-gray-300 hover:border-blue-500 transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Content Color */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                لون المحتوى
              </label>
              <input
                type="text"
                value={contentColor}
                onChange={(e) => onContentColorChange?.(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                dir="ltr"
              />
              <div className="grid grid-cols-8 gap-2 mt-2">
                {contentColorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => onContentColorChange?.(color)}
                    className="w-full h-8 rounded border-2 border-gray-300 hover:border-blue-500 transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Typography Controls */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4
                className="text-xs font-bold text-gray-400 uppercase tracking-wider"
                dir="rtl"
              >
                إعدادات الخط
              </h4>

              {/* Title Typography */}
              <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  dir="rtl"
                >
                  العناوين
                </label>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-8 text-center">
                    {titleFontSize}px
                  </span>
                  <input
                    type="range"
                    min="18"
                    max="48"
                    step="1"
                    value={titleFontSize}
                    onChange={(e) =>
                      onTitleFontSizeChange?.(parseInt(e.target.value))
                    }
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => onTitleFontWeightChange?.("normal")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      titleFontWeight === "normal"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    عادي
                  </button>
                  <button
                    onClick={() => onTitleFontWeightChange?.("bold")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      titleFontWeight === "bold"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    عريض
                  </button>
                  <button
                    onClick={() => onTitleFontWeightChange?.("black")}
                    className={`flex-1 py-1.5 text-xs font-black rounded-md transition-all ${
                      titleFontWeight === "black"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    أسود
                  </button>
                </div>
              </div>

              {/* Content Typography */}
              <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  dir="rtl"
                >
                  المحتوى
                </label>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-8 text-center">
                    {contentFontSize}px
                  </span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={contentFontSize}
                    onChange={(e) =>
                      onContentFontSizeChange?.(parseInt(e.target.value))
                    }
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => onContentFontWeightChange?.("normal")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      contentFontWeight === "normal"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    عادي
                  </button>
                  <button
                    onClick={() => onContentFontWeightChange?.("bold")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                      contentFontWeight === "bold"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    عريض
                  </button>
                </div>
              </div>
            </div>

            {/* Decorations */}
            {Object.keys(decorationStyles).length > 0 && (
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  dir="rtl"
                >
                  الزخارف والإطارات
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {Object.entries(decorationStyles)
                    .filter(([key]) => key.startsWith("word"))
                    .map(([key, style]) => (
                      <button
                        key={key}
                        onClick={() => onDecorationChange?.(key)}
                        className={`p-2 rounded-lg border-2 transition-all text-center cursor-pointer ${
                          selectedDecoration === key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        dir="rtl"
                      >
                        <div className="text-lg mb-1">{style.icon}</div>
                        <div className="text-xs font-medium text-gray-700 truncate">
                          {style.name}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </AccordionSection>

          {/* References Section */}
          <AccordionSection
            title="المراجع"
            icon={BookOpen}
            expanded={expandedSections.references}
            onToggle={() => toggleSection("references")}
          >
            {/* Add Reference */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                إضافة رابط مرجعي
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  dir="ltr"
                />
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>

            {/* References List */}
            {references.length > 0 && (
              <div>
                <p
                  className="text-sm font-semibold text-gray-700 mb-2"
                  dir="rtl"
                >
                  المراجع ({references.length})
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {references.map((ref) => (
                    <div
                      key={ref.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <LinkIcon
                        size={14}
                        className="text-blue-600 flex-shrink-0"
                      />
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-xs text-gray-600 hover:text-blue-600 truncate"
                        dir="ltr"
                      >
                        {ref.url}
                      </a>
                      <button
                        onClick={() => onRemoveReference?.(ref.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors cursor-pointer"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                <Upload size={16} className="inline ml-1" />
                رفع ملف مرجعي
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={onFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="block w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center"
              >
                <p className="text-sm text-gray-600">
                  {uploadedFile
                    ? uploadedFile.name
                    : "اختر ملف (PDF, Word, TXT)"}
                </p>
              </label>
              {uploadedFile && (
                <button
                  onClick={onRemoveFile}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm transition-colors cursor-pointer"
                >
                  إزالة الملف
                </button>
              )}
            </div>

            {/* Multiple Image Upload */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                dir="rtl"
              >
                <Upload size={16} className="inline ml-1" />
                رفع صور للتحليل (للبحث المعتمد على الصور)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    onAddImages?.(files);
                    e.target.value = ""; // Reset input
                  }
                }}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="block w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer text-center"
              >
                <p className="text-sm text-gray-600">
                  📷 اختر صور (يمكنك اختيار عدة صور)
                </p>
              </label>

              {/* Uploaded Images Grid */}
              {uploadedImages && uploadedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        src={
                          img.preview || URL.createObjectURL(img.file || img)
                        }
                        alt={`صورة ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => onRemoveImage?.(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="حذف الصورة"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                        {img.file?.name || img.name || `صورة ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploadedImages && uploadedImages.length > 0 && (
                <p className="mt-2 text-xs text-green-600" dir="rtl">
                  ✓ تم رفع {uploadedImages.length} صورة
                </p>
              )}

              {/* Analyze Images Button */}
              {uploadedImages && uploadedImages.length > 0 && (
                <button
                  onClick={onAnalyzeImages}
                  disabled={isAnalyzingImages}
                  className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                    isAnalyzingImages
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isAnalyzingImages ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3v18m-9-9h18" />
                        <path d="M12 3L8.5 6.5M12 3l3.5 3.5M12 21l-3.5-3.5M12 21l3.5-3.5" />
                      </svg>
                      تحليل الصور واقتراح موضوع
                    </>
                  )}
                </button>
              )}
            </div>
          </AccordionSection>

          {/* Export Section */}
          <AccordionSection
            title="التصدير"
            icon={FileDown}
            expanded={expandedSections.export}
            onToggle={() => toggleSection("export")}
          >
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-3"
                dir="rtl"
              >
                تنسيق الحفظ
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "pdf", label: "PDF", icon: FileText },
                  { value: "html", label: "HTML", icon: FileText },
                  { value: "docx", label: "Word", icon: FileText },
                  { value: "pptx", label: "PowerPoint", icon: FileText },
                ].map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.value}
                      onClick={() => onExportFormatChange?.(format.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${
                        exportFormat === format.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={`mx-auto mb-2 ${
                          exportFormat === format.value
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p className="text-xs font-semibold text-gray-700">
                        {format.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
