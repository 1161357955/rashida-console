import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Building2, Briefcase, DollarSign, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const sectors = ["تجاري", "صناعي", "تقني", "خدمي", "زراعي", "صحي", "تعليمي", "سياحي", "عقاري", "أخرى"];
const serviceTypes = [
  "تأسيس مشروع جديد",
  "احتضان مشروع قائم",
  "دراسة جدوى",
  "استشارات إدارية",
  "تسعير عالمي",
  "خدمات حكومية",
];

const establishmentFees = {
  "تأسيس مشروع جديد": 5000,
  "احتضان مشروع قائم": 3000,
  "دراسة جدوى": 7500,
  "استشارات إدارية": 4000,
  "تسعير عالمي": 6000,
  "خدمات حكومية": 2500,
};

const incubationPercentages = {
  "تأسيس مشروع جديد": 8,
  "احتضان مشروع قائم": 10,
  "دراسة جدوى": 5,
  "استشارات إدارية": 6,
  "تسعير عالمي": 7,
  "خدمات حكومية": 4,
};

export default function RequestService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    applicant_name: "",
    email: "",
    phone: "",
    sector: "",
    service_type: "",
    num_employees: "",
    estimated_budget: "",
    description: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const estFee = establishmentFees[form.service_type] || 0;
  const incPct = incubationPercentages[form.service_type] || 0;
  const budget = Number(form.estimated_budget) || 0;
  const incubationFee = Math.round(budget * (incPct / 100));
  const totalFee = estFee + incubationFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ServiceRequest.create({
      ...form,
      num_employees: Number(form.num_employees) || 0,
      estimated_budget: budget,
      establishment_fee: estFee,
      incubation_percentage: incPct,
      total_fee: totalFee,
      status: "جديد",
      terms_accepted: termsAccepted,
      provider_enabled: providerEnabled,
      automation_status: "لم يبدأ",
    });
    setLoading(false);
    setSubmitted(true);
    toast({ title: "تم إرسال الطلب بنجاح", description: "سيتم مراجعة طلبك والتواصل معك قريباً" });
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl p-8 shadow-lg text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-[#C9E8D8] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#2D7A3E]" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">تم إرسال طلبك بنجاح!</h2>
          <p className="text-muted-foreground mb-6">سيتم مراجعة طلبك من قبل فريق الإدارة الرشيدة والتواصل معك في أقرب وقت.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/my-requests")}>عرض طلباتي</Button>
            <Button variant="outline" onClick={() => navigate("/")}>الرئيسية</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">طلب خدمة جديد</h1>
        <p className="text-muted-foreground mb-6">قم بتعبئة النموذج التالي لطلب خدمات برنامج الإدارة الرشيدة</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            معلومات المشروع والمتقدم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم الشركة / المشروع *</Label>
              <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} required placeholder="مثال: شركة النجاح" />
            </div>
            <div className="space-y-2">
              <Label>اسم مقدم الطلب *</Label>
              <Input value={form.applicant_name} onChange={(e) => update("applicant_name", e.target.value)} required placeholder="الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني *</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>رقم الجوال *</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="05xxxxxxxx" />
            </div>
          </div>
        </motion.div>

        {/* Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            تفاصيل الخدمة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>القطاع *</Label>
              <Select value={form.sector} onValueChange={(v) => update("sector", v)} required>
                <SelectTrigger><SelectValue placeholder="اختر القطاع" /></SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نوع الخدمة *</Label>
              <Select value={form.service_type} onValueChange={(v) => update("service_type", v)} required>
                <SelectTrigger><SelectValue placeholder="اختر نوع الخدمة" /></SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>عدد الموظفين المتوقع</Label>
              <Input type="number" value={form.num_employees} onChange={(e) => update("num_employees", e.target.value)} placeholder="مثال: 10" />
            </div>
            <div className="space-y-2">
              <Label>الميزانية التقديرية (ريال)</Label>
              <Input type="number" value={form.estimated_budget} onChange={(e) => update("estimated_budget", e.target.value)} placeholder="مثال: 100000" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>وصف المشروع</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="اكتب وصفاً مختصراً لمشروعك..." rows={4} />
          </div>
        </motion.div>

        {/* Fee Breakdown */}
        {form.service_type && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border-2 border-[#DDD8F0]"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#5D48A5]" />
              تفاصيل الرسوم
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">رسوم التأسيس</span>
                <span className="font-semibold text-foreground">{estFee.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">نسبة الاحتضان ({incPct}%)</span>
                <span className="font-semibold text-foreground">{incubationFee.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-[#DDD8F0]/30 rounded-xl px-4">
                <span className="font-bold text-foreground">الإجمالي</span>
                <span className="text-2xl font-bold text-[#5D48A5]">{totalFee.toLocaleString()} ريال</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Terms & Provider */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl p-6 shadow-sm border-2 border-[#C9E8D8]"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2D7A3E]" />
            الشروط والممكنات التشغيلية
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded accent-primary"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-sm text-foreground">
                أوافق على شروط وأحكام برنامج الإدارة الرشيدة وسياسة الاحتضان في شركة فلك للموارد البشرية، وأقر بأحقية تسجيل المشروع في منصة سيان (مشاة) كخدمة مقدمة من الحاضنة.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded accent-primary"
                checked={providerEnabled}
                onChange={(e) => setProviderEnabled(e.target.checked)}
              />
              <span className="text-sm text-foreground">
                أؤكد توفر الممكنات التشغيلية اللازمة من قبلي كمقدم خدمة (الموارد البشرية، الموقع، التراخيص) وأنني مستعد لبدء تقديم الخدمة فور الموافقة.
              </span>
            </label>
          </div>
          {termsAccepted && providerEnabled && (
            <p className="mt-3 text-xs text-[#2D7A3E] bg-[#C9E8D8]/40 rounded-lg p-2">
              ✅ ستنطلق الأتمتة الكاملة تلقائياً بعد الإرسال: التحقق → تفعيل الخدمة → التسجيل في سيان → تفعيل الحاضنة → الربط المالي
            </p>
          )}
        </motion.div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="rounded-xl px-8" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جارِ الإرسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال الطلب
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}