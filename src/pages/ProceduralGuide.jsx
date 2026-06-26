import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Search, ExternalLink, FileText, ChevronDown, ChevronUp, DollarSign, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const procedures = [
  {
    title: "حجز اسم تجاري",
    category: "قانوني",
    description: "حجز اسم تجاري أو اختيار اسم من الأسماء المقترحة عن طريق موقع وزارة التجارة.",
    cost: "غير محدد",
    documents: [],
    link: "https://business.sa/ar/eservices/details/e2162d09-08ef-4011-1064-08dd6aa698b2",
    steps: [],
  },
  {
    title: "مراحل برنامج الإدارة الرشيدة",
    category: "تشغيلي",
    description: "دليل شامل لمراحل رحلة رائد الأعمال ضمن برنامج الإدارة الرشيدة: من الفكرة إلى الإطلاق والتوسع، وفق منهجية تسعة أعشار.",
    cost: "حسب المرحلة",
    documents: ["السجل التجاري", "الهوية الوطنية", "خطة العمل"],
    link: "https://atwar.910ths.sa/",
    steps: [
      "نموذج العمل التجاري — بناء وتوثيق نموذج العمل بشكل واضح ومستدام",
      "اكتشاف العملاء — التحقق من وجود مشكلة حقيقية وشريحة مستهدفة",
      "تصميم النموذج الأولي (MVP) — بناء أبسط نسخة من المنتج أو الخدمة",
      "الاختبار مع العملاء المحتملين — جمع التغذية الراجعة وتحسين النموذج",
      "التمويل — البحث عن مصادر تمويل مناسبة (ذاتي، مستثمرون، صناديق)",
      "التطوير — بناء المنتج أو الخدمة بالكامل بعد التحقق من جاهزيته",
      "تصميم العلامة التجارية — هوية بصرية واضحة تعكس قيم المشروع",
      "المتطلبات الحكومية — استيفاء كافة التراخيص والاشتراطات النظامية",
      "الحملة التسويقية — إطلاق حملات توعية وتسويق قبل الإطلاق الرسمي",
      "الإطلاق — إطلاق المشروع رسمياً للسوق المستهدف",
      "التوسع بالعمل — توسيع نطاق العمل وزيادة الحصة السوقية",
    ],
  },
  {
    title: "تسجيل نموذج العمل التقني — MVP Lab",
    category: "تقني",
    description: "تسجيل نموذج العمل التقني والاستفادة من برنامج التحول الرقمي الوطني عبر منصة MVP Lab التابعة للهيئة الوطنية للتحول الرقمي، لدعم مشاريع البرمجيات كخدمة (SaaS) وتسريع النمو الرقمي.",
    cost: "مجاناً",
    documents: ["السجل التجاري", "الهوية الوطنية", "ملخص نموذج العمل التقني (Pitch Deck)"],
    link: "https://ntdp.gov.sa/mvplab",
    steps: [
      "زيارة منصة MVP Lab على رابط ntdp.gov.sa/mvplab",
      "تسجيل حساب المنشأة وإدخال بيانات المشروع التقني",
      "رفع نموذج العمل ووصف المنتج الرقمي أو الخدمة البرمجية",
      "المراجعة من فريق البرنامج والحصول على الموافقة المبدئية",
      "الاستفادة من الدعم التقني والتمويلي وبيئة الاختبار المتاحة",
    ],
  },
  {
    title: "فتح ملف منشأة في وزارة الموارد البشرية",
    category: "موارد بشرية",
    description: "فتح ملف للمنشأة الجديدة للاستفادة من خدمات وزارة الموارد البشرية والتنمية الاجتماعية.",
    cost: "مجاناً",
    documents: ["نموذج الخدمات الموحد", "الهوية الوطنية", "نسخة التفويض أو الوكالة الشرعية", "المستند الرسمي المكمل"],
    link: "https://www.hrsd.gov.sa",
    steps: [
      "زيارة موقع الخدمات الإلكترونية وتسجيل الدخول",
      "إدخال بيانات المنشأة والضغط على التالي",
      "إدخال عنوان المنشأة وتأكيد البيانات",
      "حجز موعد ومراجعة مكتب العمل",
      "تسجيل المنشأة في العنوان الوطني",
    ],
  },
  {
    title: "تسجيل منشأة في التأمينات الاجتماعية",
    category: "موارد بشرية",
    description: "تسجيل المنشأة الجديدة لدى المؤسسة العامة للتأمينات الاجتماعية.",
    cost: "مجاناً",
    documents: ["بيانات المنشأة من وزارة الموارد البشرية", "نموذج طلب الاشتراك"],
    link: "https://www.gosi.gov.sa",
    steps: [
      "زيارة موقع التأمينات واختيار تسجيل صاحب عمل",
      "إدخال رقم المكتب ورقم المنشأة",
      "إدخال رقم الهوية أو الاستقدام",
      "إدخال بيانات النشاط والموقع",
      "طباعة النموذج وإرساله لمكتب التأمينات",
    ],
  },
  {
    title: "استئجار نطاق للموقع الإلكتروني",
    category: "تشغيلي",
    description: "تسجيل واستئجار نطاق إلكتروني (Domain) لمشروع البرمجيات كخدمة (SaaS)، إذ لا تحتاج الأنشطة الرقمية إلى موقع تقليدي أو رخص بلدية أو اشتراطات الدفاع المدني.",
    cost: "حسب مزود النطاق",
    documents: ["الهوية الوطنية", "السجل التجاري"],
    link: "https://www.cst.gov.sa/",
    steps: [],
  },

  {
    title: "إصدار السجل التجاري",
    category: "قانوني",
    description: "إصدار السجل التجاري وشهادة الغرفة التجارية وفتح ملف منشأة في وزارة الموارد البشرية.",
    cost: "500 ريال للسجل الرئيسي (سنوياً) + 300-10,000 ريال اشتراك الغرفة",
    documents: ["صورة الهوية الوطنية", "السجل التجاري"],
    link: "https://business.sa/ar/eservices/details/ee829025-1253-41d3-f9fc-08dd6ab9228a",
    steps: [],
  },
  {
    title: "استخراج التأشيرات",
    category: "موارد بشرية",
    description: "استقدام القوى العاملة عبر منصة قوى لتوفير العمالة الوافدة.",
    cost: "حسب نوع التأشيرة",
    documents: [],
    link: "https://www.qiwa.sa/ar/services?persona=businessowners",
    steps: [
      "تقديم طلب أرصدة الاستقدام عبر البوابة الوطنية",
      "الإعلان عن الشواغر الوظيفية",
      "اختيار نوع التأشيرة (دائمة، مؤقتة، موسمية)",
    ],
  },
];

const categoryColors = {
  "قانوني": { bg: "bg-[#DDD8F0]", text: "text-[#5D48A5]" },
  "تشغيلي": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]" },
  "موارد بشرية": { bg: "bg-[#F5DCC8]", text: "text-[#B86B4F]" },
  "مالي": { bg: "bg-[#DDD8F0]", text: "text-[#5D48A5]" },
  "حكومي": { bg: "bg-[#C9E8D8]", text: "text-[#2D7A3E]" },
};

export default function ProceduralGuide() {
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState("الكل");

  const categories = ["الكل", ...new Set(procedures.map((p) => p.category))];

  const filtered = procedures.filter((p) => {
    const matchSearch = p.title.includes(search) || p.description.includes(search);
    const matchCat = filterCategory === "الكل" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" />
          الدليل الإجرائي
        </h1>
        <p className="text-muted-foreground mb-6">
          جميع الإجراءات والمتطلبات اللازمة لتأسيس مشروعك وفق الأنظمة السعودية
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الإجراءات..."
            className="pr-10 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const colors = categoryColors[cat];
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? (colors ? `${colors.bg} ${colors.text}` : "bg-primary text-primary-foreground")
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Procedure List */}
      <div className="space-y-3">
        {filtered.map((proc, i) => {
          const colors = categoryColors[proc.category] || categoryColors["قانوني"];
          const isExpanded = expandedIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full p-5 flex items-center gap-4 text-right hover:bg-muted/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                  <FileText className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{proc.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{proc.description}</p>
                </div>
                <Badge className={`${colors.bg} ${colors.text} border-0 text-xs flex-shrink-0`}>
                  {proc.category}
                </Badge>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-4">
                      <p className="text-sm text-muted-foreground">{proc.description}</p>

                      {proc.cost && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#B86B4F]" />
                          <span className="text-sm font-medium text-foreground">التكلفة: {proc.cost}</span>
                        </div>
                      )}

                      {proc.documents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                            <ClipboardList className="w-4 h-4" />
                            المستندات المطلوبة
                          </h4>
                          <ul className="space-y-1">
                            {proc.documents.map((doc, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {proc.steps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">خطوات التنفيذ</h4>
                          <ol className="space-y-2">
                            {proc.steps.map((step, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#DDD8F0] text-[#5D48A5] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {j + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {proc.link && (
                        <a
                          href={proc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" />
                          الرابط الرسمي
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">لا توجد نتائج مطابقة</p>
        </div>
      )}
    </div>
  );
}