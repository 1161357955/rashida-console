import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle2, Clock, AlertCircle, RefreshCw, Play,
  ChevronDown, ChevronUp, ExternalLink, Building2, Loader2,
  Link2, FileCheck, ShieldCheck, Globe, Landmark, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const STAGE_ICONS = {
  "استلام الطلب": FileCheck,
  "التحقق من الشروط": ShieldCheck,
  "تفعيل الخدمة": Zap,
  "التسجيل في سيان": Globe,
  "ربط الحاضنة": Building2,
  "الربط المالي": Landmark,
  "مكتمل": CheckCircle2,
  "خطأ": AlertCircle
};

const STAGE_COLORS = {
  "استلام الطلب": "bg-[#DDD8F0] text-[#5D48A5]",
  "التحقق من الشروط": "bg-[#F5DCC8] text-[#B86B4F]",
  "تفعيل الخدمة": "bg-[#DDD8F0] text-[#5D48A5]",
  "التسجيل في سيان": "bg-[#C9E8D8] text-[#2D7A3E]",
  "ربط الحاضنة": "bg-[#C9E8D8] text-[#2D7A3E]",
  "الربط المالي": "bg-[#F5DCC8] text-[#B86B4F]",
  "مكتمل": "bg-[#C9E8D8] text-[#2D7A3E]",
  "خطأ": "bg-red-100 text-red-600"
};

const STATUS_BADGES = {
  "ناجح": "bg-[#C9E8D8] text-[#2D7A3E]",
  "في الانتظار": "bg-[#F5DCC8] text-[#B86B4F]",
  "قيد التنفيذ": "bg-[#DDD8F0] text-[#5D48A5]",
  "فشل": "bg-red-100 text-red-600"
};

export default function AutomationDashboard() {
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState(null);
  const [expandedReq, setExpandedReq] = useState(null);

  const loadData = async () => {
    const [reqs, allLogs] = await Promise.all([
      base44.entities.ServiceRequest.list("-created_date", 50),
      base44.entities.AutomationLog.list("-created_date", 200)
    ]);
    setRequests(reqs);
    setLogs(allLogs);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const runAutomation = async (req) => {
    setRunningId(req.id);
    try {
      const res = await base44.functions.invoke("processServiceAutomation", { request_id: req.id });
      await loadData();
      toast({
        title: "تمت الأتمتة",
        description: `أُنجزت ${res.data.stages_completed} من ${res.data.total_stages} مراحل — ${req.company_name}`
      });
    } catch (e) {
      toast({ title: "خطأ في الأتمتة", description: e.message, variant: "destructive" });
    }
    setRunningId(null);
  };

  const getLogsForRequest = (reqId) => logs.filter(l => l.request_id === reqId);

  const totalRequests = requests.length;
  const completedCount = requests.filter(r => r.automation_status === "مكتمل").length;
  const pendingCount = requests.filter(r => r.automation_status === "لم يبدأ").length;
  const runningCount = requests.filter(r => r.automation_status === "جارٍ التنفيذ").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              لوحة التكامل الآلي
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              أتمتة كاملة: الإدارة الرشيدة → سيان (مشاة) → حاضنة فلك → النظام المالي
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} className="rounded-xl gap-2">
            <RefreshCw className="w-4 h-4" />
            تحديث
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "إجمالي الطلبات", value: totalRequests, color: "bg-[#DDD8F0] text-[#5D48A5]" },
          { label: "مكتملة آلياً", value: completedCount, color: "bg-[#C9E8D8] text-[#2D7A3E]" },
          { label: "قيد التنفيذ", value: runningCount, color: "bg-[#F5DCC8] text-[#B86B4F]" },
          { label: "تنتظر التشغيل", value: pendingCount, color: "bg-[#DDD8F0] text-[#5D48A5]" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Integration Pipeline Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 mb-6 shadow-sm overflow-x-auto"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">مسار التكامل الآلي</h3>
        <div className="flex items-center gap-2 min-w-max">
          {[
            { label: "طلب الخدمة", icon: FileCheck, color: "bg-[#DDD8F0] text-[#5D48A5]" },
            { label: "التحقق والشروط", icon: ShieldCheck, color: "bg-[#F5DCC8] text-[#B86B4F]" },
            { label: "تفعيل الخدمة", icon: Zap, color: "bg-[#DDD8F0] text-[#5D48A5]" },
            { label: "سيان / مشاة", icon: Globe, color: "bg-[#C9E8D8] text-[#2D7A3E]" },
            { label: "حاضنة فلك", icon: Building2, color: "bg-[#C9E8D8] text-[#2D7A3E]" },
            { label: "النظام المالي", icon: Landmark, color: "bg-[#F5DCC8] text-[#B86B4F]" },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${step.color}`}>
                <step.icon className="w-4 h-4" />
                <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
              </div>
              {i < 5 && <div className="w-6 h-0.5 bg-border flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          <a
            href="https://sian.monshaat.gov.sa/en/startups/985"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            فلك للموارد البشرية — حاضنات سيان / مشاة (985)
          </a>
        </div>
      </motion.div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
          <p className="text-muted-foreground">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => {
            const reqLogs = getLogsForRequest(req.id);
            const isExpanded = expandedReq === req.id;
            const isRunning = runningId === req.id;
            const automationDone = req.automation_status === "مكتمل";
            const automationRunning = req.automation_status === "جارٍ التنفيذ";

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl shadow-sm overflow-hidden"
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedReq(isExpanded ? null : req.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{req.company_name}</span>
                      {req.sian_ref && (
                        <span className="text-xs bg-[#C9E8D8] text-[#2D7A3E] px-2 py-0.5 rounded-full">{req.sian_ref}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{req.service_type} · {req.sector}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Indicators */}
                    {req.incubator_activated && (
                      <span title="الحاضنة مفعلة"><Building2 className="w-4 h-4 text-[#2D7A3E]" /></span>
                    )}
                    {req.financial_integrated && (
                      <span title="الربط المالي مكتمل"><Landmark className="w-4 h-4 text-[#B86B4F]" /></span>
                    )}
                    <Badge className={`text-xs border-0 ${
                      automationDone ? "bg-[#C9E8D8] text-[#2D7A3E]" :
                      automationRunning ? "bg-[#DDD8F0] text-[#5D48A5]" :
                      req.automation_status === "يحتاج مراجعة" ? "bg-[#F5DCC8] text-[#B86B4F]" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {req.automation_status}
                    </Badge>
                    {!automationDone && (
                      <Button
                        size="sm"
                        className="rounded-lg h-7 px-3 text-xs"
                        disabled={isRunning}
                        onClick={(e) => { e.stopPropagation(); runAutomation(req); }}
                      >
                        {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? "جارٍ..." : "تشغيل"}
                      </Button>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-border/50"
                    >
                      <div className="p-4 space-y-3">
                        {/* Request details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground">مقدم الطلب</p>
                            <p className="font-medium text-foreground">{req.applicant_name}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground">الميزانية</p>
                            <p className="font-medium text-foreground">{req.estimated_budget?.toLocaleString()} ريال</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground">الإجمالي</p>
                            <p className="font-medium text-[#5D48A5]">{req.total_fee?.toLocaleString()} ريال</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-muted-foreground">الشروط مقبولة</p>
                            <p className="font-medium text-foreground">{req.terms_accepted ? "✅ نعم" : "❌ لا"}</p>
                          </div>
                        </div>

                        {/* Automation logs */}
                        {reqLogs.length > 0 ? (
                          <div>
                            <h4 className="text-xs font-semibold text-foreground mb-2">سجل التنفيذ الآلي</h4>
                            <div className="space-y-1.5">
                              {reqLogs.map((log) => {
                                const StageIcon = STAGE_ICONS[log.stage] || Database;
                                return (
                                  <div key={log.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 text-xs">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${STAGE_COLORS[log.stage] || "bg-muted text-foreground"}`}>
                                      {log.stage}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${STATUS_BADGES[log.status] || "bg-muted"}`}>
                                      {log.status}
                                    </span>
                                    <span className="text-muted-foreground">{log.message}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-2">لم يتم تشغيل الأتمتة بعد — اضغط "تشغيل" لبدء المعالجة</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}