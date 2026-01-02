import React from "react";
import { AlertCircle, UserPlus, PlusCircle, X } from "lucide-react";

/**
 * ResearchActionNotice - Displays action buttons above research content
 * to inform users about pending changes and allow them to apply changes
 *
 * Props:
 * - hasNewSections: boolean - true if new sections were added
 * - newSectionsList: array - list of new section names
 * - hasNameChanges: boolean - true if researcher/supervisor names changed
 * - researcherName: string - current researcher name
 * - supervisorName: string - current supervisor name
 * - onAddSectionsToResearch: function - callback to add new sections
 * - onUpdateNames: function - callback to update names
 * - onDismiss: function - callback when user dismisses the notice
 */
export default function ResearchActionNotice({
  hasNewSections = false,
  newSectionsList = [],
  hasNameChanges = false,
  researcherName = "",
  supervisorName = "",
  onAddSectionsToResearch,
  onUpdateNames,
  onDismiss,
}) {
  // Don't show if no changes
  if (!hasNewSections && !hasNameChanges) {
    return null;
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <AlertCircle size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800" dir="rtl">
              لديك تغييرات جديدة
            </h3>
            <p className="text-sm text-gray-600" dir="rtl">
              اختر الإجراء المناسب لتطبيق التغييرات على البحث الحالي
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            title="إخفاء"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add New Sections Button */}
        {hasNewSections && newSectionsList.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3 mb-3">
              <PlusCircle size={20} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1" dir="rtl">
                  أقسام جديدة تم إضافتها
                </h4>
                <ul className="text-sm text-gray-600 space-y-1" dir="rtl">
                  {newSectionsList.map((section, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={onAddSectionsToResearch}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              dir="rtl"
            >
              <PlusCircle size={18} />
              إضافة الأقسام الجديدة للبحث الحالي
            </button>
          </div>
        )}

        {/* Update Names Button */}
        {hasNameChanges && (
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3 mb-3">
              <UserPlus size={20} className="text-green-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1" dir="rtl">
                  تحديث الأسماء
                </h4>
                <div className="text-sm text-gray-600 space-y-1" dir="rtl">
                  {researcherName && (
                    <p>
                      <span className="font-medium">اسم الباحث:</span>{" "}
                      {researcherName}
                    </p>
                  )}
                  {supervisorName && (
                    <p>
                      <span className="font-medium">اسم المشرف:</span>{" "}
                      {supervisorName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onUpdateNames}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              dir="rtl"
            >
              <UserPlus size={18} />
              تحديث الأسماء في البحث
            </button>
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="mt-4 text-xs text-gray-500 text-center" dir="rtl">
        💡 لن يتم إعادة إنشاء البحث بالكامل، سيتم فقط تطبيق التغييرات المحددة
      </p>
    </div>
  );
}
