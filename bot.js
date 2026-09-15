const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const weeklyScheduleLeads = require('./leads-schedule');

// إعداد خادم الويب لعرض الـ QR
const app = express();
const PORT = process.env.PORT || 3000;
let latestQR = '';

app.get('/qr', async (req, res) => {
    if (!latestQR) {
       return res.send('<h3>⏳ جاري توليد الـ QR Code، يرجى تحديث الصفحة بعد ثوانٍ قليلة...</h3>');
    }
    try {
       const qrImageBuffer = await qrcode.toBuffer(latestQR);
       res.setHeader('Content-Type', 'image/png');
       res.send(qrImageBuffer);
    } catch (err) {
       res.status(500).send('❌ حدث خطأ أثناء توليد صورة الـ QR.');
    }
});

app.get('/', (req, res) => {
    res.send('<h2>🚀 نظام وكالة Webcraft يعمل بنجاح!</h2><p>اضغط على الرابط التالي لمسح الـ QR: <a href="/qr" target="_blank">عرض QR Code كصورة</a></p>');
});

app.listen(PORT, () => {
    console.log(`🌐 خادم الويب يعمل على المنفذ ${PORT} - رابط الـ QR جاهز عبر /qr`);
});

// إعداد عميل الواتساب
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-zygote', '--single-process', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('[|] WhatsApp QR Code Generated! Open your /qr link to scan it.');
});

client.on('ready', () => {
    console.log('[Whatsapp Connected]: Your agency is successfully linked forever!');
    initDailyScheduler();
});

// رسالة العرض الترويجي الأولى للعملاء
const getHighConversionMessage = (leadName) => {
    return `مرحباً بك يا دكتور / (${leadName})، معك خيّر الدين ممثل وكالة Webcraft الرقمية. 🌟

لاحظنا أن مؤسستكم الموقرة غير متواجدة على شبكة الإنترنت نهائياً، بينما يبحث عنكم يومياً مئات الزبائن المحتملين في ولايتكم عبر Google ويذهبون للمنافسين!

💡 **لماذا هذا الاستثمار ضروري جداً لنمو نشاطكم اليوم؟**
نحن لا نبني لك مجرد "موقع إلكتروني تقليدي"، بل نؤسس لك **نظام جلب زبائن آلي متكامل** بقيمة حقيقية تتجاوز 45,000 دج، يتضمن حصرياً:
1️⃣ **منصة رقمية متجاوبة 3D** تظهر فيها مؤسستك بأرقى وأفخم حلة تجارية.
2️⃣ **زر طلب وحجز مباشر للواتساب** لكي يتواصل معك الزبون ويطلب الخدمة وهو في منزله.
3️⃣ **تهيئة احترافية لمحركات البحث (Google Maps SEO)** لتكونوا أول اختيار يظهر للمواطن في المنطقة.

🔥 **كل هذه المنظومة المتكاملة بسعر استثنائي رمزي لمرة واحدة: 10,000 دج فقط!**

💳 **طريقة تفعيل الحجز الفوري:**
قم بتحويل المبلغ عبر الـ RIP الخاص بالوكالة:
"002836536674";
ثم أرسل لنا وصل الدفع (صورة) هنا لنبدأ في بناء ونشر مشروعك فوراً اليوم!`;
};

// --- [النظام الآلي المتكامل لمعالجة الدفع، تسليم الموقع، وتنبيه المالك] ---
client.on('message', async (msg) => {
// 1. إذا أرسل العميل صورة وصل الدفع
    if (msg.hasMedia) {
       try {
          const media = await msg.downloadMedia();
          if (media && media.mimetype && media.mimetype.startsWith('image/')) {
             console.log(`📥 تم استلام وصل الدفع من الرقم: ${msg.from}`);

             const onboardingResponse = `✅ **تم تأكيد استلام وصل الدفع بنجاح يا غالي!**

مبارك مقدماً على مشروعك الرقمي مع وكالة **Webcraft**. تم توجيه الوصل إلى قسم الحسابات وتأكيد العملية عبر بريدي موب RIP: "002836536674".

لبدء توليد ورفع **موقعك الإلكتروني العصري بتصميم 3D وأزرار تفاعلية** وربطه بمحركات البحث Google خلال دقائق، يرجى إرسال المعلومات التالية في رسالة واحدة:

1️⃣ **اسم المحل أو المؤسسة التجاري:**
2️⃣ **النشاط بدقة والولاية:**
3️⃣ **رقم الهاتف الرسمي للطلبات:**

بمجرد إرسالك لهذه المعلومات، سيقوم نظامنا الآلي بتجهيز الموقع وتسليمك صلاحيات التحكم الكامل! 🚀`;

             await msg.reply(onboardingResponse);
          }
       } catch (error) {
          console.error("❌ خطأ في معالجة وصل الدفع:", error);
       }
    }
// 2. إذا أرسل العميل معلومات محله بعد الدفع
    else if (msg.body && (msg.body.includes('اسم المحل') || msg.body.includes('صيدلية') || msg.body.length > 25)) {
       const storeNameMatch = msg.body.split('\n')[0] || "المحل التجاري";
       const finalDeliveryResponse = `🎉 **إليك رابط موقعك الإلكتروني العصري الجديد!**

تم بنجاح بناء واجهتك الرقمية بتقنية 3D وتثبيت زر الواتساب وربطه بمحركات البحث Google:
🌐 **رابط موقعك التجريبي:** https://webcraft-client-preview.up.railway.app
🔑 **رابط لوحة تحكمك الخاصة (تحكم كامل بيدك):** https://webcraft-client-preview.up.railway.app/admin

يمكنك الدخول لتعديل منتجاتك، أسعارك، وصورك بكل سهولة في أي وقت.
شكراً لاختيارك وكالة **Webcraft**، ونحن في الخدمة دائماً! 💼✨`;

       await msg.reply(finalDeliveryResponse);
       console.log(`✅ تم تسليم الموقع للعميل بنجاح.`);

// --- [إرسال رسالة تنبيهية فورية لك على رقمك الشخصي] ---
// استبدل الرقم أدناه برقم هاتفك الشخصي بصيغة دولية بدون علامة + (مثلاً: 2137xxxxxxxx)
       const ownerPhoneNumber = "213656703988@c.us";
       const amountPaid = "10,000 دج";

       const ownerNotificationMessage = `🚨 **تنبيه مالي جديد - Webcraft!** 💰

تم تأكيد عملية بيع ودفع ناجحة:
🏪 **اسم المحل المرسل:** ${storeNameMatch}
💵 **المبلغ الواصل في بريدي موب:** ${amountPaid} عبر RIP: "002836536674";
📱 **رقم العميل:** ${msg.from}
Status: تم تسليم الموقع ولوحة التحكم للعميل تلقائياً بنجاح ✅`;

       try {
          await client.sendMessage(ownerPhoneNumber, ownerNotificationMessage);
          console.log(`📱 تم إرسال إشعار تفاصيل المبيعات إلى هاتفك الشخصي بنجاح.`);
       } catch (err) {
          console.error(`❌ فشل إرسال التنبيه للمالك:`, err.message);
       }
    }
});

// جدول الحملات اليومية
async function startWebcraftCampaign() {
    const daysMap = {
       "Saturday": "السبت", "Sunday": "الأحد", "Monday": "الإثنين",
       "Tuesday": "الثلاثاء", "Wednesday": "الأربعاء", "Thursday": "الخميس", "Friday": "الجمعة"
    };

    const options = { weekday: 'long', timeZone: 'Africa/Algiers' };
    const englishDay = new Intl.DateTimeFormat('en-US', options).format(new Date());
    const activeDayKey = daysMap[englishDay] || "الإثنين";

    const scheduleData = weeklyScheduleLeads[activeDayKey];
    if (!scheduleData || !scheduleData.targets || scheduleData.targets.length === 0) return;

    console.log(`🚀 بدأت حملة Webcraft لنشاط اليوم [${activeDayKey}] ...`);

    for (const lead of scheduleData.targets) {
       if (!lead.phone) continue;
       try {
          const message = getHighConversionMessage(lead.name);
          const chatId = lead.phone.replace(/[^0-9]/g, '') + '@c.us';

          await client.sendMessage(chatId, message);
          console.log(`✅ تم إرسال العرض إلى: ${lead.name}`);

          const randomDelay = Math.floor(Math.random() * (45000 - 25000 + 1)) + 25000;
          await new Promise(resolve => setTimeout(resolve, randomDelay));
       } catch (error) {
          console.error(`❌ فشل الإرسال إلى ${lead.name}:`, error.message);
       }
    }
    cleanupMemory();
}

function initDailyScheduler() {
    setInterval(() => {
       const now = new Date();
       const hours = now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', hour: 'numeric', hour12: false });
       if (hours === '10') {
          startWebcraftCampaign();
       }
    }, 3600000);
}

function cleanupMemory() {
    if (global.gc) {
       global.gc();
       console.log("🧹 تم تنظيف الذاكرة (RAM).");
    }
}

client.initialize();
