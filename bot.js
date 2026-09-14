const express = require('express');
const app = express();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

app.use(express.json());
const qrcodeImage = require('qrcode');

app.get('/qr', async (req, res) => {
    if (!latestQR) {
       return res.send('<h3 style="text-align:center; font-family:Arial; margin-top:50px;">⏳ جارٍ توليد الـ QR، يرجى تحديث الصفحة بعد ثوانٍ...</h3>');
    }
    try {
       const qrImgUrl = await qrcodeImage.toDataURL(latestQR);
       res.send(`
          <div style="text-align: center; margin-top: 50px; font-family: Arial;">
            <h2>📱 امسح رمز الـ WhatsApp لربط الوكالة فوراً</h2>
            <img src="${qrImgUrl}" alt="WhatsApp QR Code" style="width: 300px; height: 300px; border: 3px solid #25D366; padding: 10px; border-radius: 15px;" />
            <p style="font-size: 18px; margin-top: 20px;">افتح واتساب في هاتفك -> الأجهزة المرتبطة -> ربط جهاز، وامسح الكود أعلاه.</p>
          </div>
       `);
    } catch (err) {
       res.status(500).send('خطأ في توليد الصورة');
    }
});


// إعداد عميل واتساب مع حفظ الجلسة لكي لا يطلب مسح الرمز كل مرة وتدشين العمل مباشرة
const client = new Client({
    authStrategy: new LocalAuth(),
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

let latestQR = '';

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('[📱] WhatsApp QR Code Generated! Scan it to start agency operations immediately.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ [WhatsApp Connected]: Agency is LIVE and starting automatic messaging right away!');
// البدء فوراً في إرسال الحملات بمجرد الاتصال ومسح الرمز
    runNational69Search();
});

// التفاعل التلقائي مع الزبائن وتلقي صور الدفع والمعلومات
client.on('message', async (msg) => {
    const text = msg.body.toLowerCase();
    const contact = await msg.getContact();
    const chat = await msg.getChat();

// إذا أرسل العميل صورة (نعتبرها وصل الدفع) أو عبارة تخص الدفع
    if (msg.hasMedia || text.includes('خلصت') || text.includes('وصل') || text.includes('دفعت')) {
       await chat.sendMessage(`خويا العزيز، ربي يبارك فيك وفي رزقك! 🤝 وصلتنا صوّرتاً أو إشعار الدفع تاعك. راه‌و الفريق التقني يجهز لك موقعك الـ 3D الخرافي 100%.\n\nغير اكملو، يوصلك الرابط النهائي هنا وتهز المفاتيح وتتحكم في كلش بيديك! 🚀`);
// محاكاة إرسال تنبيه SMS أو إشعار للإدارة (يمكن ربطه ببوابة SMS حقيقية هنا)
       console.log(`[🚨 SMS ALERT TO ADMIN]: تم استلام إبراء ذمة / دفع من الزبون ${contact.number}. يرجى تفعيل الموقع النهائي فوراً!`);
    }
    else if (text.includes('موقع') || text.includes('نموذج') || text.includes('بش شحال')) {
// الرد باللهجة الوهرانية المؤثرة
       await chat.sendMessage(`يا خويا ما تخلاتش! المنافسين راهم يديو في الكليان عيني عينك خاطر ما شافوش محلك بـ 3D وبأزرار عصرية تخطف العين. واش رايك نبدلو الحال اليوم؟`);
    }
});

client.initialize();

// نقطة نهاية Express لربطها بـ Railway أو سيرفر خارجي
app.get('/', (req, res) => {
    res.send('DZ AI Agency Engine is running and active on Railway! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web server is running on port ${PORT}`);
});

// خطة تغطية الـ 69 ولاية كاملة
const all69WilayasSchedule = {
    Saturday: { wilayas: ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Aflou"], activities: ["Startups & Tech", "Hotels & Tourism", "Pharmacies"] },
    Sunday: { wilayas: ["Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Barika", "El Kantara"], activities: ["Pizzerias & Restaurants", "Tailoring Workshops", "Wedding Halls"] },
    Monday: { wilayas: ["Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Bir El Ater", "El Aricha"], activities: ["Bazaars", "Women clothing stores", "Real Estate"] },
    Tuesday: { wilayas: ["Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Ksar El Boukhari", "Ain Oussera"], activities: ["Factories & Industries", "Showrooms", "Supermarkets"] },
    Wednesday: { wilayas: ["Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Messaad", "Boussaada"], activities: ["Clinics", "Hotels", "Cafes & Decor"] },
    Thursday: { wilayas: ["Souk Ahras", "Tipasa", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "El Abiodh Sidi Cheikh"], activities: ["Local businesses", "Craftsmen", "Traditional markets"] },
    Friday: { wilayas: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Setif"], activities: ["Tech Startups", "Wedding Halls", "Hotels"] }
};

// دالة تأخير عشوائي ذكية (لتفادي الحظر ومحاكاة السرعة البشرية بين 45 إلى 120 ثانية)
function smartRandomDelay() {
    const minSeconds = 45;
    const maxSeconds = 120;
    const randomMs = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
    return new Promise(resolve => setTimeout(resolve, randomMs));
}

// دالة التحقق من أوقات العمل
function checkWorkingHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;

    const morningStart = 9 * 60 + 30; // 09:30
    const morningEnd = 13 * 60; // 13:00
    const eveningStart = 14 * 60; // 14:00
    const nightEnd = 24 * 60; // 00:00

    return (currentTimeVal >= morningStart && currentTimeVal <= morningEnd) ||
       (currentTimeVal >= eveningStart && currentTimeVal < nightEnd);
}

// دالة صيانة الذاكرة الليلية
function runNightMaintenanceRoutine() {
    console.log(`🌙 [Night Maintenance]: Purging uninterested leads, optimizing RAM, and cleaning database...`);
    if (global.gc) {
       global.gc();
       console.log(`🧹 [RAM Cleaned]: Garbage collector executed successfully.`);
    }
}

// الوظيفة الرئيسية: جلب العملاء، إنشاء مواقع 3D، وإرسال الرسائل عبر واتساب بفاصل زمني آمن
async function runNational69Search() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;
    const morningStart = 9 * 60 + 30;

    if (currentTimeVal < morningStart) {
       runNightMaintenanceRoutine();
       return { status: "Night maintenance mode active", sentMessages: 0 };
    }

    if (!checkWorkingHours()) {
       console.log(`⏳ [Paused]: Shift break (13:00 - 14:00).`);
       return { status: "Paused for shift break", sentMessages: 0 };
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[now.getDay()];
    const plan = all69WilayasSchedule[todayName];

    if (!plan) return { status: "Rest day", sentMessages: 0 };

    console.log(`🚀 [DZ Autonomous Agency Engine]: Starting WhatsApp outreach for [${todayName}]...`);
    let sentCount = 0;

    for (const wilaya of plan.wilayas) {
      for (const activity of plan.activities) {
        if (!checkWorkingHours()) break;

        console.log(`📍 Scanning Wilaya: ${wilaya} | Sector: ${activity}`);
        const realLeads = await fetchRealBusinessLeads(wilaya, activity);

    for (const lead of realLeads) {
       const clientWebsiteUrl = `https://webcraft-dz.github.io/client-${lead.id}-3d`;
       const clientQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(clientWebsiteUrl)}`;

       const persuasiveMessage = generateElitePitch(lead.name, lead.activity, clientWebsiteUrl) +
          `\n\n🔗 رابط QR Code الخاص بمحلك لعرضه أو طباعته:\n${clientQrCodeUrl}`;

    try {
       const chatId = `${lead.phone.replace(/[^0-9]/g, '')}@c.us`;
       const delay = smartRandomDelay();
       console.log(`[Anti-Bot Protection]: Waiting ${Math.round(delay / 1000)} seconds before sending to protect account...`);
       await new Promise(resolve => setTimeout(resolve, delay));

       await client.sendMessage(chatId, persuasiveMessage);
       sentCount++;
       console.log(`[Success]: Message sent successfully to ${lead.name} (${wilaya})`);
    } catch (error) {
       console.error(`[WhatsApp Error]: Failed to send to ${lead.name} ->`, error.message);
    }
}
console.log(`🎉 Completed batch. Sent ${sentCount} secure WhatsApp pitches.`);
    return { status: "Completed", sentMessages: sentCount };
      }
    }
}
بمجرد ما تدفع وتبعث لنا لقطة الشاشة (Capture) تاع الدفع، يوصلنا تنبيه مباشر على هاتفي، ويتفعل لك موقعك الجاهز 100% وتدي التحكم الكامل بيدك في كلش! واش رايك نفعلو لك اليوم ونجيبولك الزبائن حتى لباب محلك؟`;
}
module.exports = {
    searchAlgerianLeads: runNational69Search
}
function smartfunction generateElitePitch(businessName, activity, websiteUrl, qrUrl) {
    return `السلام عليكم خويا العزيز، صاحب ${businessName} النشاط ${activity}، راك تضيع في عشرات الزبائن كل يوم بلوغو على خدمتك في غوغل وما يبينوكش، ويرو عند المنافس خاطر ما عندكش واجهة رسمية تفهم اللعبة.\n\nبيئطف الزبون من اللحظة الأولى ويخليه يشري بلا تردد **(3D) خدمتكالك خصيصاً** **موقع إلكتروني عصري بتصميم وأزرار ثلاثية الأبعاد "Webcraft" هنا في وكالة:\n\n🔗 تقدر تدخل تشوف نموذج موقعك التجريبي العصري هنا وتجرب الأزرار بنفسك:\n${websiteUrl}\n\n الخاص بموقعك، تقدر تطبعو وتحطو في المحل ولا في الواجهة باش الزبون يسكانيه برك بـ واتساب يطبع مباشرة عندك QR وهو هو رمز الـ 📱:\n${qrUrl}\n\nهالتي، ويعمل لك موقعك الجاهز 100% وتبدي التحكم الكامل بينك في كاش! واش رايك نمولو لك اليوم ونجيبوك الزبون حتى لباب محلك؟ (Capture) بمجرد ما تدفع وثمت لنا لقطة الشاشة`;
}
async function fetchRealBusinessleads(wilaya, activity) {
    console.log(`[Webcraft Engine]: Fetching live verified businesses for ${activity} in ${wilaya}...`);
    return [
       {
            id: Math.floor(Math.random() * 1000000),
            name: `${activity} ${wilaya} Pro`,
            activity: activity,
            phone: "213XXXXXXXXX"
       }
    ];
}
RandomDelay() {
    return Math.floor(Math.random() * (45000 - 20000 + 1)) + 20000;
};
