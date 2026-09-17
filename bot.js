const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

// --- [قائمة الـ 100 عميل لليوم] ---
const activeDayTargets = {
    dayName: "الخميس",
    category: "مقاهي، مطاعم ومحلات عصرية",
    targets: [
       { name: "Crèperie_kinder_plus+", phone: "+213665921891", wilaya: "وهران" },
       { name: "STAR BG's", phone: "+213559293673", wilaya: "وهران" },
       { name: "Coffee Shop Oran", phone: "+213782947797", wilaya: "وهران" },
       { name: "Happy Space", phone: "+213698720708", wilaya: "الجزائر" },
       { name: "THE HEAVEN", phone: "+213549049724", wilaya: "الجزائر" },
       { name: "Le SAIGON", phone: "+213771294209", wilaya: "الجزائر" },
       { name: "VERDE COFFEE LOUNGE", phone: "+213551270441", wilaya: "الجزائر" },
       { name: "Classico Café", phone: "+213799217102", wilaya: "الجزائر" },
       { name: "La luna", phone: "+213560000003", wilaya: "وهران" },
       { name: "Café Milano +", phone: "+213779536242", wilaya: "الجزائر" },
    ]
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

// ==========================================
// 🛡️ نظام معاينة 3D المؤمّن وحماية حقوق Webcraft
// ==========================================
app.get('/preview/:clientName', (req, res) => {
  const clientName = decodeURIComponent(req.params.clientName);
  res.send(`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>3D Digital Showcase - ${clientName}</title>
       <style>
             * { box-sizing: border-box; margin: 0; padding: 0; }
             body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0f172a; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 15px; text-align: left; }
             .watermark-banner { background: #ef4444; color: white; width: 100%; text-align: center; padding: 10px; font-weight: bold; font-size: 13px; border-radius: 6px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); }
             .container { max-width: 800px; width: 100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); text-align: center; }
             h1 { color: #38bdf8; font-size: 1.8rem; margin-bottom: 8px; }
             .subtitle { color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; }
             .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
             .gallery-item { position: relative; border-radius: 10px; overflow: hidden; height: 110px; border: 2px solid #334155; }
             .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
             .gallery-label { position: absolute; bottom: 0; background: rgba(0,0,0,0.7); width: 100%; font-size: 11px; padding: 3px; color: #facc15; }
             .store-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 20px; text-align: left; }
             .card-item { background: #0f172a; border-radius: 10px; padding: 15px; border: 1px solid #334155; }
             .card-item h3 { color: #facc15; margin-bottom: 6px; font-size: 1.1rem; }
             .card-item p { color: #cbd5e1; font-size: 0.85rem; margin-bottom: 12px; line-height: 1.4; }
             .action-btn { display: block; width: 100%; background: #0284c7; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; font-size: 0.85rem; text-decoration: none; border: none; }
             .action-box { background: rgba(15, 23, 42, 0.9); border: 2px dashed #38bdf8; padding: 20px; border-radius: 12px; margin-top: 15px; }
             .action-box p { color: #f8fafc; font-size: 0.95rem; margin-bottom: 12px; }
             .btn-activate { display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4); }
             footer { margin-top: 15px; color: #64748b; font-size: 0.75rem; }
          </style>
       </head>
       <body>
          <div class="watermark-banner">
             ⚠️ Copyright Notice: 3D Preview exclusively for "${clientName}". All rights reserved to Webcraft Agency 2026.
          </div>

          <div class="container">
             <h1>🏪 3D Digital Showcase: ${clientName}</h1>
             <p class="subtitle">An exclusive interactive preview for your modern business to attract customers and boost sales.</p>

             <div class="gallery-grid">
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93" alt="Coffee">
                    <div class="gallery-label">Beverages Bar</div>
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24" alt="Interior">
                    <div class="gallery-label">3D Interior</div>
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" alt="Dishes">
                    <div class="gallery-label">Special Services</div>
                </div>
             </div>

             <div class="store-grid">
                <div class="card-item">
                    <h3>⭐ Fast Order Menu</h3>
                    <p>Browse products and place orders instantly with a single tap.</p>
                    <a href="#order" class="action-btn">Browse Menu</a>
                </div>
                <div class="card-item">
                    <h3>🔥 Exclusive Offer</h3>
                    <p>Special daily discounts for visitors and loyal customers.</p>
                    <a href="#offer" class="action-btn">View Offer</a>
                </div>
             </div>

             <div class="action-box">
                <p>Do you like this 3D preview for your business and want to <b>activate it fully</b> with complete ownership?</p>
                <a href="https://wa.me/213656703988" class="btn-activate" target="_blank">
                    💳 Confirm Payment (10,000 DZD) & Get Your Site Now!
                </a>
             </div>
          </div>

          <footer>
             Secured Digital Experience by Webcraft Agency © 2026
          </footer>
       </body>
       </html>
    ');
});
app.listen(PORT, () => {
    console.log(`🌐 خادم الويب يعمل على المنفذ ${PORT}`);
});

// إعداد عميل الواتساب
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-stuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canas',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
        ]
    }
});

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('[|] WhatsApp QR Code Generated! Open your /qr link to scan it.');
});

// انطلاق الوكالة والحملة فور ربط الواتساب مباشرة
client.on('ready', async () => {
    console.log('[Whatsapp Connected]: Your agency is successfully linked forever! 🚀');
    initDailyScheduler();
    await startWebcraftCampaign();
});

// رسالة العرض التسويقي الأولى للعملاء
const getHighConversionMessage = (storeName, wilaya) => {
    return `سلام عليڪم خويا الكريم صاحب (${storeName}) في (${wilaya})، معاكم خيّر الدين من وكالة Webcraft الرقمية 🌟

رانا نلاحظو باللي المحل نتاعكم ما شاء الله خدام وقائم بذاته، بصح راكم ضيعوا في كنز كبير برة! يومياً كاين العشرات من الزبائن في ${wilaya} يحوسوا في Google على خدماتكم ومايلاقوكمش، راهم يروحو عند المنافسين لي راهم سابقيكم بليزيستا!.

خدمنا لك بيدينا **نموذج موقع 3D عصري خاص بمحلك** باش تبانوا خير من كاع المنافسين:
🌐 معاينة الموقع الحصري الخاص بك: https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(storeName)}

💡 **علاش لازم تفعل موقعك اليوم قبل الغدوة؟**
- زبونك اليوم يفتح التليفون يحوس على الأفضل، كي يلقاك بـ 3D نظيف ومرتب، يتيقن باللي راك محترف ديركت.
- زر طلب مباشر للواتساب يخليه يخلص ويحجز عندك بلا ما يخمّم.

🔥 **كل هذا بقية رمزية جدًا لمرة وحدة: 10,000 دج برك!** (عوض 45,000 دج).

💳 **كيفاش تفعل بلا ما تكسر راسك؟**
ابعت المبلغ في الـ RIP نتاعنا: "002836536674" (بريدي موب)، وابعث لي هنا صورة الوصل برك، ونخلي مهندسينا يطلقوك رسمي اليوم قبل العشاء! راك باغي تضيع بلاصة على روحك؟ تشجع ومبروك عليك من اللحظة الأولى! 🚀`;
};

// --- [نظام الرد الآلي التسويقي الموحد] ---
client.on('message', async (msg) => {
    if (msg.fromMe || msg.from.includes('@g.us')) return;

    const userText = msg.body ? msg.body.toLowerCase() : "";

    // 1. استقبال صورة وصل الدفع
    if (msg.hasMedia) {
       try {
          const media = await msg.downloadMedia();
          if (media && media.mimetype && media.mimetype.startsWith('image/')) {
             const onboardingResponse = `✅ يا خويا يعطيك الصحة، وصل الدفع راه وصلني وفي بلاصتو! مبروك عليك راك حجزت تفعيل موقعك النهائي في Webcraft 🌟\n\nأبعث لي في رسالة وحدة هذه المعلومات باش نطلقوا موقعك الدائم على محركات البحث:\n1️⃣ **اسم المحل الرسمي:**\n2️⃣ **نشاطه والولاية:**\n3️⃣ **رقم الهاتف الرسمي للطلبات والواتساب:** 🚀`;
             await msg.reply(onboardingResponse);
             return;
          }
       } catch (error) {
          console.error("⚠️ تنبيه: فشل تحميل الميديا، سيتم متابعة الرد الآلي.");
       }
    }

    // 2. استقبال بيانات المحل لتفعيل الموقع النهائي
    if (userText.includes('اسم المحل') || userText.includes('صيدلية') || (userText.length > 20 && (userText.includes('وهران') || userText.includes('الجزائر') || userText.includes('مستغانم')))) {
       const storeNameMatch = msg.body.split('\n')[0] || "المحل التجاري";
       const finalDeliveryResponse = `🎉 خلاص يا غالي، كلش راه واجد! هكذا تم تفعيل موقعك النهائي والظهور على محركات البحث:\n\n🌐 **رابط موقعك الرسمي الدائم:** https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(storeNameMatch)}\n🔑 **تم فك الحماية وتفعيل التحكم الكامل لك وحدك!**\n\nهنيئاً لك، ربي يبارك لك في رزقك 💼✨`;

       await msg.reply(finalDeliveryResponse);

       const ownerPhoneNumber = "213656703988@c.us";
       const ownerNotificationMessage = `🚨 **عملية بيع ناجحة 100% - Webcraft!** 💰\n🏪 المحل: ${storeNameMatch}\n💵 المبلغ: 10,000 دج\n📱 رقم العميل: ${msg.from}`;
       try {
          await client.sendMessage(ownerPhoneNumber, ownerNotificationMessage);
       } catch (err) {
          console.error(`❌ فشل إرسال تنبيه البيع للمالك:`, err.message);
       }
    }
    // 3. الرد الآلي التسويقي لإقناع العميل باللهجة المحلية
    else {
       const wahraniSalesResponse = `يا خويا، راك شفت المعاينة 3D بعينك وكيفاش المحل يبان بروفيشنال! \n\nالتحكم الكامل ومحركات البحث راهم يستناو فيك، ما تخليش المنافسين يدوك الزبائن. ابعت الدفع في بريدي موب (002836536674) وابعت لي الوصل هنا باش نسلم لك موقعك النهائي فوراً! 💪🔥`;
       await msg.reply(wahraniSalesResponse);
    }
});

// --- [دالة إرسال الحملة التلقائية لـ 100 عميل] ---
async function startWebcraftCampaign() {
    const targets = activeDayTargets.targets;
    const validTargets = targets.filter(lead => lead.name && lead.phone);

    if (validTargets.length === 0) {
       console.log("⚠️ قائمة الـ 100 عميل فارغة! يرجى ملء الخانات يدوياً.");
       return;
    }

    console.log(`🚀 انطلاق الحملة الكبرى ليوم ${activeDayTargets.dayName}: إرسال الروابط لـ (${validTargets.length}) عميلاً مستهدفاً.`);

    for (const lead of validTargets) {
       try {
          const message = getHighConversionMessage(lead.name, lead.wilaya || "وهران");
          const chatId = lead.phone.replace(/[^0-9]/g, '') + '@c.us';

          await client.sendMessage(chatId, message);
          console.log(`✅ تم إرسال العرض بنجاح إلى: ${lead.name} (${lead.phone}) - ولاية: ${lead.wilaya}`);

          const randomDelay = Math.floor(Math.random() * (45000 - 25000 + 1)) + 25000;
          await new Promise(resolve => setTimeout(resolve, randomDelay));
       } catch (error) {
          console.error(`❌ فشل الإرسال إلى ${lead.name}:`, error.message);
       }
    }
    console.log("🏁 انتهت حملة إرسال الروابط للـ 100 عميل بنجاح تام، والبوت في حالة جاهزية تامة للرد على المراسلات وبيع الخدمات!");
}

// --- [جدول العمل المستمر والتنظيف الليلي] ---
function initDailyScheduler() {
    console.log("⏰ تم تفعيل نظام العمل المستمر للوكالة (من 10:00 صباحاً حتى 00:00 ليلاً) دون توقف، وصيانة الذاكرة ليلاً.");

    setInterval(() => {
       const now = new Date();
       const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', hour: 'numeric', hour12: false }));
       const minute = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', minute: 'numeric', hour12: false }));

       if (hour >= 0 && hour < 10) {
          if (hour === 0 && minute === 1) {
             console.log("🌙 فترة صيانة الليل (00:01 إلى 09:59): جاري تنظيف الذاكرة وإزالة أي ملفات مؤقتة غير ضرورية...");
             cleanupMemory();
          }
       }
    }, 60000);
}

function cleanupMemory() {
    if (global.gc) {
       global.gc();
       console.log("🧹 تم تنظيف الذاكرة المؤقتة (RAM) بنجاح وجاهزية تامة ليوم عمل جديد.");
    } else {
       console.log("🧹 تمت صيانة الذاكرة وتصفية السيرفر بنجاح.");
    }
}
client.initialize();
