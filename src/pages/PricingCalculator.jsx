import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowLeftRight, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const globalModels = [
  { name: "النموذج الأمريكي (USD)", currency: "USD", rate: 3.75, baseFee: 2500, percentage: 12 },
  { name: "النموذج البريطاني (GBP)", currency: "GBP", rate: 4.72, baseFee: 2000, percentage: 10 },
  { name: "النموذج الأوروبي (EUR)", currency: "EUR", rate: 4.08, baseFee: 2200, percentage: 11 },
  { name: "النموذج الإماراتي (AED)", currency: "AED", rate: 1.02, baseFee: 8000, percentage: 8 },
  { name: "النموذج الكندي (CAD)", currency: "CAD", rate: 2.78, baseFee: 3000, percentage: 9 },
  { name: "النموذج الأسترالي (AUD)", currency: "AUD", rate: 2.50, baseFee: 3500, percentage: 10 },
];

const sectors = ["تجاري", "صناعي", "تقني", "خدمي", "زراعي", "صحي", "تعليمي", "سياحي", "عقاري"];

export default function PricingCalculator() {
  const [employees, setEmployees] = useState("");
  const [sector, setSector] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [calculated, setCalculated] = useState(false);

  const numEmp = Number(employees) || 0;
  const numBudget = Number(budget) || 0;
  const model = globalModels.find((m) => m.name === selectedModel);

  const handleCalculate = () => {
    if (numEmp > 0 && numBudget > 0 && model) {
      setCalculated(true);
    }
  };

  const originalFee = model ? model.baseFee : 0;
  const originalFeeSAR = model ? Math.round(model.baseFee * model.rate) : 0;
  const pctFee = model ? Math.round(numBudget * (model.percentage / 100)) : 0;
  const pctFeeSAR = pctFee;
  const totalSAR = originalFeeSAR + pctFeeSAR;

  const sectorMultiplier = sector === "تقني" ? 1.15 : sector === "صحي" ? 1.2 : sector === "صناعي" ? 1.1 : 1;
  const adjustedTotal = Math.round(totalSAR * sectorMultiplier);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          حاسبة التسعير العالمي
        </h1>
        <p className="text-muted-foreground mb-6">
          قارن نماذج التسعير العالمية وحوّلها إلى الريال السعودي بناءً على بيانات مشروعك
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">بيانات المشروع</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>القطاع</Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger><SelectValue placeholder="اختر القطاع" /></SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>عدد الموظفين</Label>
              <Input type="number" value={employees} onChange={(e) => { setEmployees(e.target.value); setCalculated(false); }} placeholder="مثال: 25" />
            </div>
            <div className="space-y-2">
              <Label>الميزانية التقديرية (ريال سعودي)</Label>
              <Input type="number" value={budget} onChange={(e) => { setBudget(e.target.value); setCalculated(false); }} placeholder="مثال: 500000" />
            </div>
            <div className="space-y-2">
              <Label>نموذج التسعير العالمي</Label>
              <Select value={selectedModel} onValueChange={(v) => { setSelectedModel(v); setCalculated(false); }}>
                <SelectTrigger><SelectValue placeholder="اختر النموذج" /></SelectTrigger>
                <SelectContent>
                  {globalModels.map((m) => <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCalculate} className="w-full rounded-xl" size="lg" disabled={!numEmp || !numBudget || !model}>
              <Calculator className="w-4 h-4 ml-2" />
              احسب التكلفة
            </Button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {calculated && model ? (
            <>
              {/* Conversion Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border-2 border-[#C9E8D8]">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowLeftRight className="w-5 h-5 text-[#2D7A3E]" />
                  <h3 className="font-semibold text-foreground">تحويل العملة</h3>
                </div>
                <div className="flex items-center justify-between bg-[#E3F5EC] rounded-xl p-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">سعر الصرف</p>
                    <p className="text-lg font-bold text-[#2D7A3E]">1 {model.currency} = {model.rate} ريال</p>
                  </div>
                  <Globe className="w-8 h-8 text-[#2D7A3E] opacity-50" />
                </div>
              </div>

              {/* Breakdown Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#5D48A5]" />
                  <h3 className="font-semibold text-foreground">تفاصيل التكلفة</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <div>
                      <p className="text-sm text-foreground">رسوم التأسيس الأساسية</p>
                      <p className="text-xs text-muted-foreground">{originalFee.toLocaleString()} {model.currency}</p>
                    </div>
                    <span className="font-semibold text-foreground">{originalFeeSAR.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <div>
                      <p className="text-sm text-foreground">نسبة الاحتضان ({model.percentage}%)</p>
                      <p className="text-xs text-muted-foreground">من الميزانية التقديرية</p>
                    </div>
                    <span className="font-semibold text-foreground">{pctFeeSAR.toLocaleString()} ريال</span>
                  </div>
                  {sectorMultiplier !== 1 && (
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <div>
                        <p className="text-sm text-foreground">معامل القطاع ({sector})</p>
                        <p className="text-xs text-muted-foreground">×{sectorMultiplier}</p>
                      </div>
                      <span className="font-semibold text-[#B86B4F]">+{(adjustedTotal - totalSAR).toLocaleString()} ريال</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 bg-[#DDD8F0]/30 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-bold text-foreground text-lg">الإجمالي بالريال السعودي</span>
                  <span className="text-3xl font-bold text-[#5D48A5]">{adjustedTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* All Models Comparison */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">مقارنة جميع النماذج</h3>
                <div className="space-y-2">
                  {globalModels.map((m) => {
                    const mBase = Math.round(m.baseFee * m.rate);
                    const mPct = Math.round(numBudget * (m.percentage / 100));
                    const mTotal = Math.round((mBase + mPct) * sectorMultiplier);
                    const isSelected = m.name === selectedModel;
                    return (
                      <div
                        key={m.name}
                        className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                          isSelected ? "bg-[#DDD8F0]/40 border border-[#5D48A5]/20" : "hover:bg-muted/50"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted-foreground">تأسيس: {mBase.toLocaleString()} + احتضان: {mPct.toLocaleString()}</p>
                        </div>
                        <span className={`font-bold ${isSelected ? "text-[#5D48A5]" : "text-foreground"}`}>
                          {mTotal.toLocaleString()} ريال
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <div className="w-16 h-16 bg-[#DDD8F0] rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-[#5D48A5]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">أدخل بيانات مشروعك</h3>
              <p className="text-sm text-muted-foreground">قم بتعبئة البيانات واختيار نموذج التسعير لمشاهدة النتائج</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}