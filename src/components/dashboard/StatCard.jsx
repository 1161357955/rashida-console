import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const colorMap = {
    mint: "bg-[#C9E8D8] text-[#2D7A3E]",
    lavender: "bg-[#DDD8F0] text-[#5D48A5]",
    peach: "bg-[#F5DCC8] text-[#B86B4F]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.lavender}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}