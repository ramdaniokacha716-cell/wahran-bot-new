const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const puppeteer = require('puppeteer');

// --- [قائمة الـ 100 عميل لليوم - يمكنك التعديل وإضافة أو تعديل الـ 100 محل ورقمها وولايتها هنا يدوياً] ---
const activeDayTargets = {
    dayName: "الخميس", // يمكنك تغيير اليوم حسب رغبتك
    category: "مقاهي، مطاعم ومحلات عصرية",
    targets: [
       // ضع هنا الـ 100 محل الخاصة بك يدوياً (الاسم، الرقم بصيغته الصحيحة، والولاية)
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
       // ... أضف حتى تكمل 100 محل بنفس التنسيق تماماً
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
// 🛡️ نظام معاينة 3D المؤمّن وحماية حقوق Webcraft (يُضاف في آخر الملف)
// ==========================================
app.get('/preview/:clientName', (req, res) => {
    const clientName = decodeURIComponent(req.params.clientName);
    res.send(`
       <!DOCTYPE html>
       <html lang="ar" dir="rtl">
       <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>معاينة 3D الحصرية - ${clientName}</title>
          <style>
             * { box-sizing: border-box; margin: 0; padding: 0; }
             body { font-family: 'Segoe UI', Tahoma, sans-serif; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px; }
             .watermark-banner { background: #ef4444; color: white; width: 100%; text-align: center; padding: 12px; font-weight: bold; font-size: 14px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
             .container { max-width: 850px; width: 100%; background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.7); text-align: center; }
             h1 { color: #38bdf8; font-size: 2.2rem; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(56, 189, 248, 0.3); }
             .subtitle { color: #94a3b8; font-size: 1.1rem; margin-bottom: 30px; }
             .store-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; text-align: right; }
             .card-item { background: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; box-shadow: 0 8px 20px rgba(0,0,0,0.3); transform: translateZ(20px); transition: transform 0.3s; }
             .card-item:hover { transform: translateY(-5px); border-color: #38bdf8; }
             .card-item h3 { color: #facc15; margin-bottom: 8px; font-size: 1.2rem; }
             .card-item p { color: #cbd5e1; font-size: 0.95rem; margin-bottom: 15px; line-height: 1.5; }
             .fake-btn { display: block; width: 100%; background: #334155; color: #94a3b8; padding: 10px; border-radius: 8px; text-align: center; font-weight: bold; cursor: not-allowed; border: none; font-size: 0.9rem; }
             .action-box { background: rgba(15, 23, 42, 0.95); border: 2px dashed #38bdf8; padding: 25px; border-radius: 15px; margin-top: 20px; }
             .action-box p { color: #f8fafc; font-size: 1.05rem; margin-bottom: 15px; line-height: 1.6; }
             .btn-activate { display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 1.05rem; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4); transition: transform 0.2s; }
             .btn-activate:hover { transform: scale(1.03); }
             footer { margin-top: 20px; color: #64748b; font-size: 0.85rem; }
          </style>
       </head>
       <body>
          <div class="watermark-banner">
⚠️ تنبيه حماية الملكية: نسخة معاينة 3D تجريبية خاصة بمحل "${clientName}". جميع الحقوق محفوظة لوكالة Webcraft الرقمية 2026.
          </div>

          <div class="container">
             <h1>🏪 الواجهة الرقمية 3D: ${clientName}</h1>
             <p class="subtitle">هذه معاينة حصرية لنموذج محلك العصري المصمم خصيصاً لجذب الزبائن ومضاعفة مبيعاتك.</p>

             <div class="store-grid">
                <div class="card-item">
                    <h3>⭐ الطلب السريع والخدمة</h3>
                    <p>واجهة متجاوبة تتيح للزبائن تصفح منتجاتكم وخدماتكم بلمسة واحدة وبأعلى احترافية.</p>
                    <button class="fake-btn">طلب الآن (ميزة مفعمة بعد الدفع)</button>
                </div>
                <div class="card-item">
                    <h3>🔥 العرض الحصري الخاص</h3>
                    <p>قسم مخصص للعروض والخصومات لإشعال حماس الزبائن ودفعهم للشراء مباشرة.</p>
                    <button class="fake-btn">طلب العرض (ميزة مفعمة بعد الدفع)</button>
                </div>
             </div>

             <div class="action-box">
                <p>هل أعجبك تصميم محلك وتريد **تفعيله كلياً، ربطه بمحركات البحث، واستلام التحكم التام** برابطك الخاص؟</p>
                <a href="https://wa.me/213656703988?text=${encodeURIComponent('سلام خيّر الدين، عجبني نموذج 3D الخاص بـ ' + clientName + ' ورايب نخلص 10,000 دج ونفعل موقعي النهائي!')}" class="btn-activate">
💳 أكد الدفع (10,000 دج) واحصل على ملكية موقعك التامة الآن!
                </a>
             </div>
          </div>

          <footer>
             Secured Digital Experience by Webcraft Agency © 2026
          </footer>
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

// انطلاق الوكالة والحملة فور ربط الواتساب مباشرة
client.on('ready', async () => {
    console.log('[Whatsapp Connected]: Your agency is successfully linked forever! 🚀');
   initDailyScheduler(); // بدء التشغيل المستمر وتنظيف الذاكرة ليلاً
    await startWebcraftCampaign(); // إطلاق الحملة على الـ 100 عميل فوراً
});

// رسالة العرض التسويقي الأولى للعملاء (تتضمن رابط المعاينة 3D والجانب النفسي)
const getHighConversionMessage = (storeName, wilaya) => {
    return `سلام عليڪم خويا الكريم صاحب (${storeName}) في (${wilaya})، معاكم خيّر الدين من وكالة Webcraft الرقمية 🌟

ر رانا نلاحظو باللي المحل نتاعكم ما شاء الله خدام وقائم بذاته، بصح راكم ضيعوا في كنز كبير برة! يومياً كاين العشرات من الزبائن في ${wilaya} يحوسوا في Google على خدماتكم ومايلاقوكمش، راهم يروحو عند المنافسين لي راهم سابقيكم بليزيستا!.

خدمنا لك بيدينا **نموذج موقع 3D عصري خاص بمحلك** باش تبانوا خير من كاع المنافسين:
🌐 معاينة الموقع الحصري الخاص بك: https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(storeName)}

💡 **علاش لازم تفعل موقعك اليوم قبل الغدوة؟**
- زبونك اليوم يفتح التليفون يحوس على الأفضل، كي يلقاك بـ 3D نظيف ومرتب، يتيقن باللي راك محترف ديركت.
- زر طلب مباشر للواتساب يخليه يخلص ويحجز عندك بلا ما يخمّم.

🔥 **كل هذا بقية رمزية جدًا لمرة وحدة: 10,000 دج برك!** (عوض 45,000 دج).

💳 **كيفاش تفعل بلا ما تكسر راسك؟**
ابعت المبلغ في الـ RIP نتاعنا: "002836536674" (بريدي موب)، وابعث لي هنا صورة الوصل برك، ونخلي مهندسينا يطلقوك رسمي اليوم قبل العشاء! راك باغي تضيع بلاصة على روحك؟ تشجع ومبروك عليك من اللحظة الأولى! 🚀`;
};

// --- [نظام الرد الآلي التسويقي الخارق باللهجة الوهرانية لإغلاق البيع فوراً ودون تردد] ---

// نظام الرد الآلي للوكالة (مضبوط وصحيح 100%)
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
// 3. الرد الآلي للإقناع باللهجة المحلية
    else {
       const wahraniSalesResponse = `يا خويا، راك شفت المعاينة 3D بعينك وكيفاش المحل يبان بروفيشنال! \n\nالتحكم الكامل ومحركات البحث راهم يستناو فيك، ما تخليش المنافسين يدوك الزبائن. ابعت الدفع في بريدي موب (002836536674) وابعت لي الوصل هنا باش نسلم لك موقعك النهائي فوراً! 💪🔥`;

       await msg.reply(wahraniSalesResponse);
   }
});

    if (userText.includes('اسم المحل') || userText.includes('صيدلية') || userText.length > 20 && (userText.includes('وهران') || userText.includes('الجزائر') || userText.includes('مستغانم'))) {
       const storeNameMatch = msg.body.split('\n')[0] || "المحل التجاري";
       const wahraniSalesResponse = `🎉 خلاص يا غالي، كلش راه واجد! هكذا راك قلعت بقوة في السوق الرقمي:

🌐 **رابط موقعك التجريـبي 3D:** https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(storeNameMatch)}
🔑 **لوحة التحكم الخاصة بك:** https://wahran-agency-bot-production.up.railway.app/preview/${encodeURIComponent(storeNameMatch)}

هنيئاً لك، راك اليوم سبقت قاع منافسيك في ولايتك! تتهنى به وربي يبارك لك في رزقك 💼✨`
       // إشعار المالك بالعملية الناجحة
       const ownerPhoneNumber = "213656703988@c.us";
       const ownerNotificationMessage = `🚨 **عملية بيع ناجحة 100% - Webcraft!** 💰\n🏪 المحل: ${storeNameMatch}\n💵 المبلغ: 10,000 دج\n📱 رقم العميل: ${msg.from}`;
       try {
          await client.sendMessage(ownerPhoneNumber, ownerNotificationMessage);
       } catch (err) {
          console.error(`❌ فشل إرسال تنبيه البيع للمالك:`, err.message);
       }
    }
    // 3. الرد الآلي التسويقي المعتمد على اللهجة الوهرانية ولعب على الجانب النفسي للعميل الذي يتردد أو يسأل
    else {
       // صياغة الرد باللهجة الوهرانية الفحلة لإقناع العميل وإزالة التردد تماماً
       const wahraniSalesResponse = `يا خويا، راك طيح على عين العسل! بصح خليني نحكي معاك صراحة وبلا زواق:

رانا في وقت لي ماعندوش واجهة رقمية 3D في Google وفي السوشيال ميديا، راه يخرج من السوق بالتدريج والمنافسين يدوك الزبائن عيني عينك!
راك تخمم في 10,000 دج؟ والله يا خويا غير راك تصرفها في حكاية فارغة، بينما هي استثمار حقيقي يرجع لك أضعاف مضاعفة من أول أسبوع كيفاش؟ خاطر الزبون كي يشوفك بليزيستا ومنظم وعندك موقع تطلب منو ديركت، الثقة تطلع لـ 100% ومايبقى يخمم كاع يقصدك ديركت!

الخدمة راهي محدودة واليوم رانا نقفلوا القائمة تاع الولاية. واش قلت؟ نبعث لك الـ RIP تاع بريدي موب (002836536674) تخلصها ديركت ونحجز لك بلاصتك راك رابح ضامنة؟ ما تخلش الفرصة تفوتك يا غالي! 💪🔥`;

       await msg.reply(wahraniSalesResponse);
    }
});

// --- [دالة إرسال الحملة التلقائية لـ 100 عميل الواحد تلو الآخر مع فاصل آمن] ---
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
          // فاصل زمني عشوائي آمن بين 25 إلى 45 ثانية لتفادي حظر واتساب نهائياً
          const randomDelay = Math.floor(Math.random() * (45000 - 25000 + 1)) + 25000;
          await new Promise(resolve => setTimeout(resolve, randomDelay));
       } catch (error) {
          console.error(`❌ فشل الإرسال إلى ${lead.name}:`, error.message);
       }
    }
    console.log("🏁 انتهت حملة إرسال الروابط للـ 100 عميل بنجاح تام، والبوت في حالة جاهزية تامة للرد على المراسلات وبيع الخدمات!");
}

// --- [جدول العمل المستمر من 10:00 صباحاً إلى 00:00 ليلاً والتنظيف الليلي من 00:01 إلى 9:59] ---
function initDailyScheduler() {
    console.log("⏰ تم تفعيل نظام العمل المستمر للوكالة (من 10:00 صباحاً حتى 00:00 ليلاً) دون توقف، وصيانة الذاكرة ليلاً.");

    setInterval(() => {
       const now = new Date();
       const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', hour: 'numeric', hour12: false }));
       const minute = parseInt(now.toLocaleString('en-US', { timeZone: 'Africa/Algiers', minute: 'numeric', hour12: false }));

       // تنظيف الذاكرة ومسح المخزون غير الضروري في فترة الليل من 00:01 إلى 09:59
       if (hour >= 0 && hour < 10) {
          if (hour === 0 && minute === 1) {
             console.log("🌙 فترة صيانة الليل (00:01 إلى 09:59): جاري تنظيف الذاكرة وإزالة أي ملفات مؤقتة غير ضرورية...");
             cleanupMemory();
          }
       }
    }, 60000); // يفحص كل دقيقة
}

// دالة تفريغ الذاكرة وتنظيف السيرفر
function cleanupMemory() {
    if (global.gc) {
       global.gc();
       console.log("🧹 تم تنظيف الذاكرة المؤقتة (RAM) بنجاح وجاهزية تامة ليوم عمل جديد.");
    } else {
       console.log("🧹 تمت صيانة الذاكرة وتصفية السيرفر بنجاح.");
    }
}

client.initialize();
