import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Send, Calculator, FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import MilestoneCard from "@/components/dashboard/MilestoneCard";

const milestones = [
  {
    title: "المتطلبات القانونية",
    category: "قانوني",
    steps: ["حجز اسم تجاري", "إصدار السجل التجاري", "إصدار وتوثيق عقد التأسيس", "شهادة إيداع رأس المال"],
  },
  {
    title: "المتطلبات التشغيلية",
    category: "تشغيلي",
    steps: ["استئجار موقع", "موافقة الدفاع المدني", "استخراج رخصة البلدية", "استخراج التأشيرات"],
  },
  {
    title: "الموارد البشرية",
    category: "موارد بشرية",
    steps: ["فتح ملف منشأة", "تسجيل في التأمينات الاجتماعية", "استخراج التأشيرات", "تجديد السجل التجاري"],
  },
];

const quickActions = [
  { label: "طلب خدمة جديد", path: "/request-service", icon: Send, color: "bg-[#DDD8F0] text-[#5D48A5]" },
  { label: "حاسبة التسعير", path: "/pricing-calculator", icon: Calculator, color: "bg-[#C9E8D8] text-[#2D7A3E]" },
  { label: "الدليل الإجرائي", path: "/procedural-guide", icon: FolderOpen, color: "bg-[#F5DCC8] text-[#B86B4F]" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [me, reqs] = await Promise.all([
        base44.auth.me(),
        base44.entities.ServiceRequest.list("-created_date", 50),
      ]);
      setUser(me);
      setRequests(reqs);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "جديد" || r.status === "قيد المراجعة").length;
  const completedRequests = requests.filter((r) => r.status === "مكتمل").length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          مرحباً {user?.full_name || "بك"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          مرحباً بك في برنامج الإدارة الرشيدة — شركة فلك للموارد البشرية
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FileText} label="إجمالي الطلبات" value={totalRequests} color="lavender" delay={0.1} />
        <StatCard icon={Send} label="طلبات قيد المعالجة" value={pendingRequests} color="peach" delay={0.15} />
        <StatCard icon={FileText} label="طلبات مكتملة" value={completedRequests} color="mint" delay={0.2} />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <Link
                to={action.path}
                className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                <ArrowLeft className="w-4 h-4 text-muted-foreground mr-auto group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">مراحل رحلة التأسيس</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((m, i) => (
            <MilestoneCard key={m.title} {...m} delay={0.3 + i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
}