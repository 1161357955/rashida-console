import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { FileText, Loader2, Clock, CheckCircle2, XCircle, Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusConfig = {
  "جديد": { bg: "bg-[#DDD8F0]", text: "text-[#5D48A5]", icon: Clock },
  "قيد المراجعة": { bg: "bg-[#F5DCC8]", text: "text-[#B86B4F]", icon: Clock },
  "مقبول": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]", icon: CheckCircle2 },
  "مرفوض": { bg: "bg-red-100", text: "text-red-600", icon: XCircle },
  "مكتمل": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]", icon: CheckCircle2 },
};

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.ServiceRequest.list("-created_date", 50);
      setRequests(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = requests.filter(
    (r) => r.company_name?.includes(search) || r.service_type?.includes(search) || r.applicant_name?.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              طلباتي
            </h1>
            <p className="text-muted-foreground mt-1">متابعة جميع طلبات الخدمة المقدمة</p>
          </div>
          <Link to="/request-service">
            <Button className="rounded-xl">طلب جديد</Button>
          </Link>
        </div>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث في الطلبات..."
          className="pr-10 rounded-xl"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#DDD8F0] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#5D48A5]" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد طلبات</h3>
          <p className="text-sm text-muted-foreground mb-4">لم تقم بتقديم أي طلبات بعد</p>
          <Link to="/request-service">
            <Button className="rounded-xl">تقديم طلب جديد</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, i) => {
            const status = statusConfig[req.status] || statusConfig["جديد"];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedReq(req)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{req.company_name}</h3>
                    <p className="text-xs text-muted-foreground">{req.service_type} · {req.sector}</p>
                  </div>
                  <Badge className={`${status.bg} ${status.text} border-0 text-xs gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {req.status}
                  </Badge>
                  {req.total_fee > 0 && (
                    <span className="text-sm font-bold text-[#5D48A5]">{req.total_fee?.toLocaleString()} ريال</span>
                  )}
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedReq} onOpenChange={() => setSelectedReq(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedReq && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">اسم الشركة</p>
                  <p className="font-medium text-foreground">{selectedReq.company_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">مقدم الطلب</p>
                  <p className="font-medium text-foreground">{selectedReq.applicant_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">نوع الخدمة</p>
                  <p className="font-medium text-foreground">{selectedReq.service_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">القطاع</p>
                  <p className="font-medium text-foreground">{selectedReq.sector}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium text-foreground">{selectedReq.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">رقم الجوال</p>
                  <p className="font-medium text-foreground">{selectedReq.phone}</p>
                </div>
              </div>
              {selectedReq.description && (
                <div>
                  <p className="text-sm text-muted-foreground">وصف المشروع</p>
                  <p className="text-sm font-medium text-foreground">{selectedReq.description}</p>
                </div>
              )}
              <div className="bg-[#DDD8F0]/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رسوم التأسيس</span>
                  <span className="font-medium">{selectedReq.establishment_fee?.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">نسبة الاحتضان</span>
                  <span className="font-medium">{selectedReq.incubation_percentage}%</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border/50 pt-2">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-bold text-[#5D48A5]">{selectedReq.total_fee?.toLocaleString()} ريال</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}