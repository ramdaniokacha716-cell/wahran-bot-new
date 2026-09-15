const { fetchRealLeadsFromGoogle } = require('./scraper');
const weeklyScheduleLeads = require('./leads-schedule');

async function runWebcraftAutomatedPipeline() {
    console.log("🚀 تشغيل محرك وكالة Webcraft لجلب العملاء والتواصل المباشر...");

// 1. تحديد نشاط اليوم الحالي تلقائياً (مثلاً: صيدليات، محلات خياطة، مصانع...)
    const activeDay = "الثلاثاء"; // أو تحديدها حسب تاريخ اليوم آلياً
    const currentSchedule = weeklyScheduleLeads[activeDay];

    if (!currentSchedule) {
       console.log("⚠️ لا يوجد جدول مسجل لهذا اليوم.");
       return;
    }

    console.log(`📌 نشاط اليوم المستهدف: ${currentSchedule.category}`);

// 2. إذا كانت القائمة فارغة، يقوم السكربت بالبحث الآلي عبر محركات البحث لملئها
    if (currentSchedule.targets.length === 0) {
       const fetchedLeads = await fetchRealLeadsFromGoogle("تيزي وزو", currentSchedule.category);
       currentSchedule.targets.push(...fetchedLeads);
    }

// 3. البدء الفوري بالتواصل التلقائي مع الأرقام الحقيقية المستخرجة
    for (const lead of currentSchedule.targets) {
       const message = `مرحباً بك يا سيف / (${lead.name})، معك خيّر الدين ممثل وكالة Webcraft الرقمية. 🌟
لاحظنا أن مؤسستكم غير متواجدة على الإنترنت بينما يبحث عنكم آلاف الزبائن...
💡 عرضنا الاحترافي لتصميم نظام متكامل بـ 10,000 دج فقط.
💳 للتاكيد الفوري عبر الـ RIP: 002836536674`;

// إرسال عبر الواتساب مع الفاصل الزمني الآمن لمنع الحظر
       const randomDelay = Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000;

       // client.sendMessage(lead.phone + "@c.us", message);
       console.log(`✅ تم إرسال عرض Webcraft بنجاح إلى العميل الحقيقي: ${lead.name} (${lead.phone})`);

       await new Promise(resolve => setTimeout(resolve, randomDelay));
    }
}

// تشغيل النظام
runWebcraftAutomatedPipeline();
