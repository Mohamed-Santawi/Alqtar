/**
 * Section Helper Utilities
 * Helper functions for managing research sections
 */

/**
 * Extract sections from research content
 * Only detects lines starting with ## (markdown headers) as main sections
 * @param {string} content - The research content
 * @returns {Array} Array of section objects {id, title, index}
 */
export function extractSections(content) {
  const sections = [];
  const seenSections = new Set(); // لمنع التكرار
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // ✅ CRITICAL: Only detect lines that start with ## as main sections
    if (!trimmed.startsWith("##")) {
      return;
    }

    // Remove ## prefix
    const cleanedLine = trimmed.replace(/^##\s+/, "");

    // استبعاد الفهرس نفسه من القائمة
    if (cleanedLine.includes("فهرس المحتوى") || cleanedLine.match(/^فهرس/i)) {
      return;
    }

    // استبعاد الأسماء (الطالب/المشرف)
    if (
      cleanedLine.startsWith("الطالب:") ||
      cleanedLine.startsWith("المشرف:")
    ) {
      return;
    }

    // إنشاء معرف فريد للقسم
    const sectionKey = cleanedLine
      .replace(/[:\-–—]/g, "")
      .trim()
      .toLowerCase();

    // منع التكرار - إذا كان القسم موجود بالفعل، لا نضيفه
    if (!seenSections.has(sectionKey)) {
      seenSections.add(sectionKey);
      const sectionId = `section-${index}-${cleanedLine
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}`;
      sections.push({
        id: sectionId,
        title: cleanedLine, // العنوان بدون ## prefix
        index: index,
      });
    }
  });

  return sections;
}

/**
 * Scroll to a specific section
 * @param {string} sectionId - The section element ID to scroll to
 */
export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
