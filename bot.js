const express = require('express');
const app = express();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let latestQR = null;

const client = new Client({
    authStrategy: new LocalAuth({
       dataPath: '.wwebjs_auth'
    }),
    puppeteer: {
       headless: true,
       args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
       ]
    }
});

client.on('qr', (qr) => {
latestQR = qr;
    console.log('[📱] WhatsApp QR Code Generated!');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ [WhatsApp Connected]: Your agency is successfully linked forever!');
});

client.on('authenticated', () => {
    console.log('🔑 [Authentication]: Session saved successfully.');
});

// الرد الآلي الذكي على العملاء
client.on('message', async (msg) => {
    if (msg.from.endsWith('@c.us') && !msg.fromMe) {
       const text = msg.body.toLowerCase();
       if (text.includes('سعر') || text.includes('كم') || text.includes('شحال') || text.includes('كيفاش') || text.includes('مهتم')) {
       const replyText = `فهمتك مليح خويا العزيز، بصح حبيت أقولك بلي المحل أو المؤسسة تاعك تستاهل تكون الواجهة الأولى في منطقتك وما تخليهمش يروحوا للمنافس. استثمار رمزي بـ 10000 دج فقط رح يرجعلك أضعاف مضاعفة من الزبائن الجدد كل يوم!\n\n💳 لإتمام الطلب، قم بتحويل المبلغ إلى حسابنا:\nرقم الحساب RIP: 002836536674\nاسم المستفيد: Khair Eddine Bettouche\n\nوبعد التحويل أرسل لنا صورة وصل الدفع (Reçu) هنا، ومعها:\n1. اسم المحل أو المؤسسة بدقة\n2. الشعار (Logo إن وجد)\n3. رقم الهاتف والخدمات لي تحب تظهر في الموقع.\n\nوسنرفعه لك على محركات البحث ويصبح تحت تحكمك 100% بين يديك!`;
          setTimeout(async () => { await client.sendMessage(msg.from, replyText); }, 3000);
       }
       if (text.includes('وصل') || text.includes('دفع') || text.includes('خلصت')) {
          const successResponse = `بارك الله فيك يا مبدع! تم استلام طلبك وتأكيد الدفع بنجاح 🚀.\nفريق وكالة "Webcraft" راهو يخدم في اللحظة هذه على تفعيل موقعك الخاص وربطه بنظام التحكم الكامل وتجهيز أزرار 3D. سنرسل لك رابط التحكم النهائي خلال دقائق قليلة!`;
          setTimeout(async () => { await client.sendMessage(msg.from, successResponse); }, 2000);
       }
    }
});

client.initialize();

// الجدول اليومي (20 عميل: 10 لكل تخصص)
const dailyTargetSchedule = {
    Saturday: { wilayas: ["Algiers", "Oran", "Constantine"], batch1: { activity: "فنادق", count: 10 }, batch2: { activity: "مؤسسات", count: 10 } },
    Sunday: { wilayas: ["Blida", "Setif", "Annaba"], batch1: { activity: "شركات", count: 10 }, batch2: { activity: "مصانع", count: 10 } },
    Monday: { wilayas: ["Mostaganem", "Tlemcen", "Batna"], batch1: { activity: "محلات ملابس رجال", count: 10 }, batch2: { activity: "محلات نساء", count: 10 } },
    Wednesday: { wilayas: ["Biskra", "Djelfa", "Tiaret"], batch1: { activity: "مقاهي ومطاعم", count: 10 }, batch2: { activity: "قاعات أفراح", count: 10 } },
    Thursday: { wilayas: ["Skikda", "Mascara", "El Oued"], batch1: { activity: "شركات مقاولات", count: 10 }, batch2: { activity: "متاجر تجارية", count: 10 } },
    Friday: { wilayas: ["Boumerdes", "Tipasa", "Ghardaia"], batch1: { activity: "وكالات سياحية", count: 10 }, batch2: { activity: "معارض تجارية", count: 10 } }
};

let weeklyAcquiredLeads = [];

function smartRandomDelay() {
    return new Promise(resolve => setTimeout(resolve, (Math.floor(Math.random() * (120 - 45 + 1) + 45)) * 1000));
}

function checkWorkingHours() {
    const now = new Date();
    const timeVal = now.getHours() * 60 + now.getMinutes();
    return (timeVal >= 570 && timeVal <= 780) || (timeVal >= 840 && timeVal < 1440);
}

// مسح الذاكرة أسبوعياً يوم الجمعة 00:00 ليلاً
setInterval(() => {
    const now = new Date();
    if (now.getDay() === 5 && now.getHours() === 0 && now.getMinutes() === 0) {
       weeklyAcquiredLeads = [];
       if (global.gc) global.gc();
    }
}, 60000);

async function runDailyAgencyOutreach() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayPlan = dailyTargetSchedule[days[now.getDay()]];
    if (!dayPlan || !checkWorkingHours()) return;

    let sentCount = 0;
    for (const batch of [dayPlan.batch1, dayPlan.batch2]) {
       for (let i = 1; i <= batch.count; i++) {
          if (!checkWorkingHours()) break;
          const wilaya = dayPlan.wilayas[Math.floor(Math.random() * dayPlan.wilayas.length)];
          const lead = {
            id: Math.floor(Math.random() * 900000) + 100000,
            name: `${batch.activity} ${wilaya} ${i}`,
            activity: batch.activity,
            wilaya: wilaya,
            phone: `2135${Math.floor(Math.random() * 90000000 + 10000000)}`
          };

          if (weeklyAcquiredLeads.includes(lead.phone)) continue;

          const url = `https://webcraft-dz.github.io/client-${lead.id}-3d`;
          const qr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
          const msg = `السلام عليكم خويا صاحب ${lead.name} (${lead.activity}). تبارك الله النشاط تاعك في ${lead.wilaya} راهو ماشيي، بصح خليني نحكيهالك صراحة وعينك تشوف: راك تضيع في عشرات الزبائن الكبار كل يوم يلوجو على خدمتك في غوغل وما يصيبوكش، ويرو عند المنافس خاطر ما عندكش واجهة رسمية.\n\nحنا في وكالة "Webcraft" خدمنالك خصيصاً **موقع إلكتروني عصري بتصاميم وأزرار ثلاثية الأبعاد (3D)** يليق بمقدار نشاطك باش يبان المحل تاعك فخم ومفتوح 24/7!\n\n🔗 تقدر تدخل تشوف نموذج موقعك الحصري هنا:\n${url}\n\n📱 وهذ هو رمز الـ QR الخاص بموقعك تقدر تطبعو وتحطو في المحل باش الزبون يسكانيه برك يدخل عندك:\n${qr}\n\nواش رايك نفعلو لك نهائياً اليوم بـ 10000 دج ونجيبولك الزبائن حتى لباب محلك؟`;

          try {
            await smartRandomDelay();
            await client.sendMessage(`${lead.phone}@c.us`, msg);
            sentCount++;
            weeklyAcquiredLeads.push(lead.phone);
          } catch (err) {
            console.error(err.message);
          }
       }
    }
    return { status: "Completed", sentMessages: sentCount };
}

app.get('/qr', async (req, res) => {
    if (latestQR) {
       try {
          const qrcodeLib = require('qrcode');
          const stream = await qrcodeLib.toDataURL(latestQR);
          res.send(`<div style="text-align: center; margin-top: 50px;"><img src="${stream}" width="300" height="300"/><p>Scan with WhatsApp (Linked Devices)</p></div>`);
       } catch (e) {
          res.send(latestQR);
       }
    } else {
       res.send('<h3>WhatsApp is already connected forever or QR is generating...</h3>');
    }
});

app.listen(process.env.PORT || 3000);
module.exports = { searchAlgerianLeads: runDailyAgencyOutreach };

// --- [القائمة الكاملة لأهداف صيدليات اليوم: تيزي وزو، بجاية، والشلف + رسالة القيمة المضافة] ---
const targetLeadsToday = [
// صيدليات تيزي وزو
    { name: "Pharmacie Mechiche Ahcene", phone: "+21326121720", type: "صيدلية", wilaya: "تيزي وزو" },
    { name: "Pharmacie RABIA Lyes", phone: "+21326111263", type: "صيدلية", wilaya: "تيزي وزو" },
    { name: "Pharmacie Chifa (ALIOUANE Eps MENAA)", phone: "+213698858892", type: "صيدلية", wilaya: "تيزي وزو" },
    { name: "Pharmacie TABOUDJEMATHS", phone: "+213774872910", type: "صيدلية", wilaya: "تيزي وزو" },

// صيدليات بجاية
    { name: "Pharmacie Ainennas Habiba Ep Amedjkouh", phone: "+21334180036", type: "صيدلية", wilaya: "بجاية" },
    { name: "Pharmacie Mokrani Epse Temzi", phone: "+21334169341", type: "صيدلية", wilaya: "بجاية" },
    { name: "Pharmacie Les Trois Horloges", phone: "+213556232220", type: "صيدلية", wilaya: "بجاية" },

// صيدليات الشلف
    { name: "PHARMACIE CHEBRI", phone: "+213770334575", type: "صيدلية", wilaya: "الشلف" },
    { name: "Pharmacie ABBOURA", phone: "+21327779129", type: "صيدلية", wilaya: "الشلف" },
    { name: "Ait Hamoudha Samia", phone: "+213561077352", type: "صيدلية", wilaya: "الشلف" }
];

// --- [نص الرسالة التسويقية المحملة بالقيمة المضاعفة لتجاوز مقاومة السعر] ---
const getHighConversionMessage = (leadName) => {
    return `مرحباً بك يا سيف / دكتور (${leadName})، معك خيّر الدين ممثل وكالة Webcraft الرقمية. 🌟

لاحظنا أن مؤسستكم الموقرة غير متواجدة على شبكة الإنترنت، بينما يبحث آلاف الزبائن يومياً عبر Google عن خدماتكم في ولايتكم ولا يجدونكم، بل يذهبون للمنافسين!

💡 **عرض خاص ومحدود لـ 24 ساعة القادمة:**
نحن لا نبيع لك مجرد "موقع إلكتروني"، بل نبني لك **نظام جلب زبائن متكامل** بقيمة حقيقية تتجاوز 45,000 دج، يتضمن:
1️⃣ **تصميم موقع احترافي متجاوب 3D** يظهر فيه اسم صدليتكم بأرقى حلة.
2️⃣ **ربط مباشر بزر الواتساب** لكي يحجز الزبائن الأدوية أو الاستشارات مباشرة من بيوتهم.
3️⃣ **تهيئة كاملة للظهور في محركات البحث (Google Maps SEO)** لكي تظهر في المرتبة الأولى بالمنطقة.
4️⃣ **هدية مجانية:** دليل إدارة الحملات الرقمية للأنشطة الصحية محلياً.

🔥 **كل هذا بمبلغ استثنائي رمزي لمرة واحدة: 10,000 دج فقط!**
*(أي أن جلب زبون واحد إضافي بفضل الموقع سيغطي تكلفة الموقع بالكامل خلال أول أسبوع).*

💳 **طريقة التأكيد الفوري للحجز:**
قم بتحويل المبلغ عبر الـ RIP الخاص بالوكالة:
`002836536674`
ثم أرسل لنا وصل الدفع هنا لنبدأ العمل على مشروعك فوراً اليوم!`;
};
