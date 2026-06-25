import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const categoryColors = {
  "قانوني": { bg: "bg-[#DDD8F0]", text: "text-[#5D48A5]", ring: "#5D48A5" },
  "تشغيلي": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]", ring: "#2D7A3E" },
  "موارد بشرية": { bg: "bg-[#F5DCC8]", text: "text-[#B86B4F]", ring: "#B86B4F" },
  "مالي": { bg: "bg-[#DDD8F0]", text: "text-[#5D48A5]", ring: "#5D48A5" },
  "حكومي": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]", ring: "#2D7A3E" },
};

export default function MilestoneCard({ title, category, steps, delay = 0 }) {
  const colors = categoryColors[category] || categoryColors["قانوني"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          {category}
        </span>
      </div>
      <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {steps.slice(0, 3).map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{step}</span>
          </div>
        ))}
        {steps.length > 3 && (
          <p className="text-xs text-muted-foreground">+{steps.length - 3} إجراءات أخرى</p>
        )}
      </div>
      <Link
        to="/procedural-guide"
        className={`mt-4 flex items-center gap-1 text-sm font-medium ${colors.text} hover:opacity-80 transition-opacity`}
      >
        عرض التفاصيل
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}