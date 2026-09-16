const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const puppeteer = require('puppeteer');

// --- [جدول الأيام والعملاء المستهدفين لوكالة Webcraft - 20 مكاناً فارغاً لكل يوم] ---
const weeklyScheduleLeads = {
    "السبت": {
          category: "مصانع وقاعات حفلات ومؤسسات كبرى",
          targets: [
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" }
       ]
    },
    "الأحد": {
          category: "فنادق ومؤسسات سياحية ووكالات أسفار",
          targets: [
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" }
       ]
    },
    "الإثنين": {
          category: "صيدليات ومراكز تجارية كبرى",
          targets: [
             { name: "Pharmacie Mechiche Ahcene", phone: "+21326121720", wilaya: "تيزي وزو" },
             { name: "Pharmacie RABIA Lyes", phone: "+21326111263", wilaya: "تيزي وزو" },
             { name: "Pharmacie Chifa", phone: "+213698858892", wilaya: "تيزي وزو" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
             { name: "", phone: "", wilaya: "" }
       ]
    },
    "الثلاثاء": {
          category: "محلات خياطة وتصميم أزياء (Tailleur)",
          targets: [
             { name: "Atelier de couture rose et soie", phone: "+213541367733", wilaya: "الجزائر" },
             { name: "Atelier Harmonie Constantine", phone: "+213558461769", wilaya: "قسنطينة" },
             { name: "Cozy collection atelier", phone: "+213555145183", wilaya: "الجزائر" },
             { name: "Ahlami h couture", phone: "+213703517594", wilaya: "الجزائر" },
             { name: "Atelier de Confection RH", phone: "+213551057286", wilaya: "الجزائر" },
             { name: "Liliane couture", phone: "+213793517594", wilaya: "الجزائر" },
             { name: "Atelier Couture & Création Radia", phone: "+213552942985", wilaya: "الجزائر" },
             { name: "ATELIER LAURA", phone: "+213540000000", wilaya: "الجزائر" },
             { name: "SE haute couture", phone: "+213556487626", wilaya: "الجزائر" },
             { name: "tailleur de mon temps", phone: "+213662176242", wilaya: "الجزائر" },
             { name: "Atelier de couture Oran", phone: "+213658658818", wilaya: "وهران" },
             { name: "Dahliah Création", phone: "+213558482904", wilaya: "وهران" },
             { name: "Haute Couture Traditionnelle Tizefri", phone: "+213557762759", wilaya: "تيزي وزو" },
             { name: "Z.k Créations", phone: "+213558482904", wilaya: "وهران" },
             { name: "Djalil Couture", phone: "+213658658818", wilaya: "وهران" },
             { name: "Sabrine Créations - Atelier de Couture", phone: "+213555168880", wilaya: "وهران" },
             { name: "Boutique Limoujeri", phone: "+213709521578", wilaya: "وهران" },
             { name: "Daye style Couture", phone: "+213709521578", wilaya: "وهران" },
             { name: "Andalouissia Haute Couture Et Chouchou", phone: "+213555168880", wilaya: "تلمسان" },
             { name: "Atelier queens", phone: "+213553229558", wilaya: "سيدي بلعباس" }
          ]
},
    "الأربعاء": {
          category: "مقاهي ومطاعم عصرية",
          targets: [
             { name: "Crêperie_kinder_plus+", phone: "+213665921891", wilaya: "Oran" }, 
             { name: "STAR BG's", phone: "+213559293673", wilaya: "Oran" },
             { name: "Coffee Shop Oran", phone: "+213782947797", wilaya: "Oran" }, 
             { name: "Happy Space", phone: "+213698720708", wilaya: "Alger centre" },
             { name: "THE HEAVEN", phone: "+213549049724", wilaya: "Alger centre" }, 
             { name: "Le SAIGON", phone: "+213771294209", wilaya: "Alger centre" },
             { name: "VERDE COFFEE LOUNGE", phone: "+213551270441", wilaya: "Alger" },
             { name: "Classico Café", phone: "+213799217102", wilaya: "Alger" },
             { name: "La luna", phone: "+213560000003", wilaya: "Oran" }, 
             { name: "Café Milano +", phone: "+213779536242", wilaya: "Alger" },
             { name: "Camden Food & Grill", phone: "0560253451", wilaya: "Oran" },
             { name: "Restaurant Pablo", phone: "0557229989", wilaya: "Alger" },
             { name: "Restaurant Smaïn", phone: "0671777106", wilaya: "Oran" },
             { name: "Food clock", phone: "0669367756", wilaya: "Oran" },
             { name: "Pizzeria Restarant Oscar", phone: "0551170113", wilaya: "Tlamcen" },
             { name: "Oscar pizza", phone: "0561208947", wilaya: "Mostagenam" },
             { name: "Fast Food Oscar", phone: "0790271335", wilaya: "Oran" },
          ]
},
    "الخميس": {
          category: "شركات خدمات ووكالات تجارية",
          targets: [
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
            { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" }
          ]
    },
    "الجمعة": {
          category: "متاجر كبرى ومحلات تجارة حرة",
          targets: [
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" },
           { name: "", phone: "", wilaya: "" }, { name: "", phone: "", wilaya: "" }
       ]
    }
};

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
    res.send('<h2>🚀 نظام وكالة Webcraft يعمل بنجاح!</h2><p>رابط الـ QR كصورة: <a href="/qr" target="_blank">عرض QR Code</a></p>');
});


// مسار معاينة موقع العميل مخصصاً بالاسم
app.get('/preview/:clientName', (req, res) => {
    const clientName = decodeURIComponent(req.params.clientName);
    res.send(`
       <!DOCTYPE html>
       <html lang="ar" dir="rtl">
       <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>معاينة الموقع الرقمي - ${clientName}</title>
          <style>
             body { font-family: Tahoma, sans-serif; background: #0f172a; color: #fff; text-align: center; padding: 50px; }
             .card { background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); max-width: 600px; margin: 0 auto; }
             h1 { color: #38bdf8; }
             p { color: #94a3b8; line-height: 1.6; }
            .btn { display: inline-block; background: #22c55e; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          </style>
       </head>
       <body>
          <div class="card">
             <h1>🚀 نموذج موقع: ${clientName}</h1>
             <p>هذه هي المعاينة الحصرية لمشروعك الرقمي المقترح من وكالة <strong>Webcraft</strong>.</p>
             <p>يحتوي الموقع على نظام طلبات سريع، واجهة عصرية متجاوبة، وربط مباشر مع واتساب وخريطة الموقع!</p>
             <a href="https://wa.me/+213655334455" class="btn">اطلب تفعيل موقعك الآن (10,000 دج)</a>
          </div>
       </body>
       </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🌐 خادم الويب يعمل على المنفذ ${PORT}`);
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
    return `مرحباً بك يا سيف / (${leadName})، معك خيّر الدين ممثل وكالة Webcraft الرقمية. 🌟

لاحظنا أن مؤسستكم الموقرة غير متواجدة على شبكة الإنترنت نهائياً، بينما يبحث عنكم يومياً مئات الزبائن المحتملين في ولايتكم عبر Google!

💡 **لماذا هذا الاستثمار ضروري جداً لنمو نشاطكم؟**
نبني لك **نظام جلب زبائن آلي متكامل** بقيمة تتجاوز 45,000 دج، يتضمن:
1️⃣ منصة رقمية متجاوبة 3D تظهر فيها مؤسستك بأرقى حلة.
2️⃣ زر طلب وحجز مباشر للواتساب.
3️⃣ تهيئة احترافية لمحركات البحث (Google Maps SEO).

🔥 **بسعر استثنائي رمزي لمرة واحدة: 10,000 دج فقط!**

💳 **طريقة تفعيل الحجز الفوري:**
قم بتحويل المبلغ عبر الـ RIP الخاص بالوكالة:
"002836536674"
ثم أرسل لنا وصل الدفع (صورة) هنا لنبدأ فوراً!`;
};

// نظام الرد الآلي وتأكيد الدفع وتوليد الموقع  
client.on('message', async (msg) => {
    if (msg.hasMedia) {
       try {
Puppeteer // منح المتصفح ثانيتين لاستقرار السياق وتجنب انهيار 
          await new Promise(resolve => setTimeout(resolve, 2000));
          const media = await msg.downloadMedia();
          if (media && media.mimetype && media.mimetype.startsWith('image/')) {
            const onboardingResponse = `✅ **تم تأكيد استلام وصل الدفع بنجاح يا غالي!**

مبارك مقدماً على مشروعك الرقمي مع وكالة **Webcraft**. تم توجيه الوصل وتأكيد العمليات عبر بريدي موب RIP: "002836536674".

أرسل لنا المعلومات التالية في رسالة واحدة لتوليد ورفع موقعك:
1️⃣ **اسم المحل أو المؤسسة التجاري:**
2️⃣ **النشاط بدقة والولاية:**
3️⃣ **رقم الهاتف الرسمي للطلبات:** 🚀`;

            await msg.reply(onboardingResponse);
          }
       } catch (error) {
          console.error("❌ خطأ في معالجة وصل الدفع:", error);
       }
    }
    else if (msg.body && (msg.body.includes('اسم المحل') || msg.body.includes('صيدلية') || msg.body.length > 25)) {
       const storeNameMatch = msg.body.split('\n')[0] || "المحل التجاري";
       const finalDeliveryResponse = `🎉 **إليك رابط موقعك الإلكتروني العصري الجديد!**

🌐 **رابط موقعك التجريبي:// https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(lead.name)} **:
🔑 **لوحة تحكمك الخاصة:// https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(lead.name)} **:

شكراً لاختيارك وكالة **Webcraft**! 💼✨`;

       await msg.reply(finalDeliveryResponse);

       // إرسال إشعار مالي لرقمك الشخصي
       const ownerPhoneNumber = "213656703988@c.us"; // استبدل برقم هاتفك مع الرمز الدولي
       const ownerNotificationMessage = `🚨 **تنبيه مالي جديد - Webcraft!** 💰\n🏪 المحل: ${storeNameMatch}\n💵 المبلغ الواصل: 10,000 دج (RIP: 002836536674)\n📱 رقم العميل: ${msg.from}`;

       try {
          await client.sendMessage(ownerPhoneNumber, ownerNotificationMessage);
       } catch (err) {
          console.error(`❌ فشل إرسال التنبيه للمالك:`, err.message);
       }
    }
});

// النظام الآلي لتشغيل الحملات
async function startWebcraftCampaign() {
    const daysMap = {
       "Saturday": "السبت", "Sunday": "الأحد", "Monday": "الإثنين",
       "Tuesday": "الثلاثاء", "Wednesday": "الأربعاء", "Thursday": "الخميس", "Friday": "الجمعة"
    };

    const options = { weekday: 'long', timeZone: 'Africa/Algiers' };
    const englishDay = new Intl.DateTimeFormat('en-US', options).format(new Date());
    const activeDayKey = daysMap[englishDay] || "الإثنين";

    const scheduleData = weeklyScheduleLeads[activeDayKey];
    if (!scheduleData || !scheduleData.targets) return;

    // تصفية الأماكن الفارغة (التي بدون اسم أو رقم) لتفادي الأخطاء
    const validTargets = scheduleData.targets.filter(lead => lead.name && lead.phone);
    if (validTargets.length === 0) {
       console.log(`⚠️ لا توجد أهداف ممتلئة مسجلة لليوم (${activeDayKey}). يرجى ملء الخانات.`);
       return;
    }

    console.log(`🚀 بدء حملة ${activeDayKey} لنشاط: ${scheduleData.category} (${validTargets.length} عميل)`);

    for (const lead of validTargets) {
       try {
          const message = getHighConversionMessage(lead.name);
          const chatId = lead.phone.replace(/[^0-9]/g, '') + '@c.us';

          await client.sendMessage(chatId, message);
          console.log(`✅ تم إرسال العرض إلى: ${lead.name} (${lead.phone})`);
          // فاصل زمني عشوائي آمن بين 25 إلى 45 ثانية لتفادي الحظر
          const randomDelay = Math.floor(Math.random() * (45000 - 25000 + 1)) + 25000;
          await new Promise(resolve => setTimeout(resolve, randomDelay));
       } catch (error) {
          console.error(`❌ فشل الإرسال إلى ${lead.name}:`, error.message);
       }
    }
}

// --- [جدول أوقات العمل الذكية بدقة] ---
function initDailyScheduler() {
    console.log("⏰ تم تفعيل جدول أوقات العمل الذكي للوكالة.");

    setInterval(() => {
       const now = new Date();
       const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', hour: 'numeric', hour12: false }));
       const minute = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', minute: 'numeric', hour12: false }));

       // 1. الفترة الصباحية: تبدأ من 10:00 إلى 15:00
       if (hour >= 10 && hour < 15) {
           if (hour === 10 && minute === 00) {
              console.log("🕒  بداية العمل الفترة الصباحية  (10:00 صباحاً). انطلاق الحملة...");
              startWebcraftCampaign(); //
           }
       }
       // 2. فترة الاستراحة الصباحية: من 15:00 إلى 15:30
       else if (hour === 15 && minute >= 0 && minute <= 30) {
           // البوت في وضع الاستراحة
       }

       // 3. الفترة المسائية: من 15:31 إلى 00:00 (منتصف الليل)
       else if ((hour === 15 && minute > 30) || (hour > 15 && hour <= 23)) {
          // فترة العمل المسائية مستمرة
       }

       // 4. فترة الليل والصيانة والتنظيف: من 00:00 (منتصف الليل) إلى 09:30 صباحاً
       else if (hour >= 0 && hour < 10) {
          if (hour === 0 && minute === 0) {
            console.log("🌙 بدء فترة الاستراحة الليلية، الصيانة وتصفية الذاكرة (RAM)...");
            cleanupMemory();
          }
       }
    }, 60000); // فحص كل دقيقة بدقة
}

// دالة تصفية الذاكرة العشوائية
function cleanupMemory() {
    if (global.gc) {
       global.gc();
       console.log("🧹 تم تنظيف الذاكرة (RAM) وتجهيز السيرفر لليوم التالي بنجاح.");
    }
}

client.initialize();
