/**
 * Content Formatting Utilities
 * Helper functions for formatting and processing research content
 */

/**
 * Add researcher and supervisor names to research content
 * @param {string} content - The research content
 * @param {string} researcherName - The researcher's name
 * @param {string} supervisorName - The supervisor's name
 * @returns {string} Content with names added
 */
export function addNamesToContent(content, researcherName = "", supervisorName = "") {
  if (!content) return "";

  // التحقق من وجود الأسماء في البداية
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
}

/**
 * Clean and format research content
 * Removes empty lines, trims whitespace, etc.
 * @param {string} content - Raw content
 * @returns {string} Cleaned content
 */
export function cleanContent(content) {
  if (!content) return "";

  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n");
}
