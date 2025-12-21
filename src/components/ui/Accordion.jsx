import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function Accordion({ children, className = "" }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon: Icon = HelpCircle,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
      initial={false}
      animate={{
        boxShadow: isOpen
          ? "0 10px 40px rgba(168, 230, 207, 0.15)"
          : "0 2px 10px rgba(0, 0, 0, 0.03)",
        borderColor: isOpen ? "#a8e6cf" : "#f3f4f6",
      }}
      transition={{ duration: 0.3 }}
      whileHover={{
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        scale: 1.01,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-lg hover:bg-gray-50/50 transition-all duration-300 text-right cursor-pointer group"
      >
        {/* Question Icon */}
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          animate={{
            background: isOpen
              ? "linear-gradient(135deg, #a8e6cf 0%, #93c5fd 100%)"
              : "#f3f4f6",
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon
            size={20}
            className={`transition-colors duration-300 ${
              isOpen ? "text-white" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
        </motion.div>

        {/* Title */}
        <span
          className={`flex-1 font-semibold text-lg transition-colors duration-300 ${
            isOpen ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
          }`}
        >
          {title}
        </span>

        {/* Arrow with cursor pointer */}
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          animate={{
            rotate: isOpen ? 180 : 0,
            backgroundColor: isOpen
              ? "rgba(168, 230, 207, 0.2)"
              : "transparent",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown
            size={22}
            className={`transition-colors duration-300 ${
              isOpen ? "text-accent-green" : "text-gray-400"
            }`}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="px-lg pb-lg pt-0"
            >
              {/* Answer with styled container */}
              <div
                className="bg-gradient-to-l from-gray-50 to-transparent rounded-xl p-md pr-0 text-secondary leading-relaxed border-r-4"
                style={{ borderRightColor: "#a8e6cf" }}
              >
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
