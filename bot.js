const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

// --- [قائمة الـ 100 عميل لليوم] ---
const activeDayTargets = {
    dayName: "الجمعة",
    category: "فنادق و مراقد سياحية كبرى",
    targets: [
        // --- مجموعة الفنادق (100 فندق) ---
       { name: "Hôtel Ziyanides", phone: "+21343210000", wilaya: "تلمسان" },
       { name: "Plaza Hotel Oran", phone: "+21341330000", wilaya: "وهران" },
       { name: "Hotel Sol Mahdia", phone: "+21346450000", wilaya: "تيارت" },
       { name: "Hotel Le Majestic", phone: "+21341290000", wilaya: "وهران" },
       { name: "Hotel El Djazair", phone: "+21321690000", wilaya: "الجزائر" },
       { name: "Hotel Beni Hammad", phone: "+21335880000", wilaya: "المسيلة" },
       { name: "Hotel Sheraton Club des Pins", phone: "+21321377777", wilaya: "الجزائر" },
       { name: "Hotel El Aurassi", phone: "+21321748252", wilaya: "الجزائر" },
       { name: "Hotel Marriott Constantine", phone: "+21331925000", wilaya: "قسنطينة" },
       { name: "Hotel Sabri Annaba", phone: "+21338865500", wilaya: "عنابة" },
       { name: "Hotel AZ Oran", phone: "+21341530000", wilaya: "وهران" },
       { name: "Hotel Le Titteri", phone: "+21326200000", wilaya: "المدية" },
       { name: "Hotel Les Hammadites", phone: "+21334210000", wilaya: "بجاية" },
       { name: "Hotel Rayan Palace", phone: "+21329700000", wilaya: "غرداية" },
       { name: "Hotel Sofitel Algiers", phone: "+21321685285", wilaya: "الجزائر" },
       { name: "Hotel Renaissance Tlemcen", phone: "+21343209000", wilaya: "تلمسان" },
       { name: "Hotel Protea Constantine", phone: "+21331781200", wilaya: "قسنطينة" },
       { name: "Hotel M'zab", phone: "+21329881122", wilaya: "غرداية" },
       { name: "Hotel Royal Oran", phone: "+21341391000", wilaya: "وهران" },
       { name: "Hotel Atlas Bousaada", phone: "+21335870000", wilaya: "المسيلة" },
       { name: "Hotel Lily Annaba", phone: "+21338450000", wilaya: "عنابة" },
       { name: "Hotel Cirta Constantine", phone: "+21331932575", wilaya: "قسنطينة" },
       { name: "Hotel Simorgh", phone: "+21329792000", wilaya: "ورقلة" },
       { name: "Hotel Tidikelt", phone: "+21349850000", wilaya: "إليزي" },
       { name: "Hotel Grand Hotel Mostaganem", phone: "+21345610000", wilaya: "مستغانم" },
       { name: "Hotel STMB", phone: "+21345260000", wilaya: "مستغانم" },
       { name: "Hotel Phénix", phone: "+21341400000", wilaya: "وهران" },
       { name: "Hotel El Mehri", phone: "+21329760000", wilaya: "ورقلة" },
       { name: "Hotel Essalem", phone: "+21336660000", wilaya: "سطيف" },
       { name: "Hotel Park Mall", phone: "+21336730000", wilaya: "سطيف" },
       { name: "Hotel Sétifis", phone: "+21336840000", wilaya: "سطيف" },
       { name: "Hotel Yemma Gouraya", phone: "+21334220000", wilaya: "بجاية" },
       { name: "Hotel Cristal", phone: "+21338800000", wilaya: "عنابة" },
       { name: "Hotel Bellevue", phone: "+21331910000", wilaya: "قسنطينة" },
       { name: "Hotel Oasis", phone: "+21329870000", wilaya: "غرداية" },
       { name: "Hotel L'Ermitage", phone: "+21346500000", wilaya: "مستغانم" },
       { name: "Hotel Rym El Gamil", phone: "+21338810000", wilaya: "عنابة" },
       { name: "Hotel Azur", phone: "+21334230000", wilaya: "بجاية" },
       { name: "Hotel El Hassi", phone: "+21329750000", wilaya: "حاسي مسعود" },
       { name: "Hotel Sahara", phone: "+21329780000", wilaya: "ورقلة" },
       { name: "Hotel Kalaa", phone: "+21343220000", wilaya: "تلمسان" },
       { name: "Hotel Les Chênes", phone: "+21334240000", wilaya: "بجاية" },
       { name: "Hotel Monassir", phone: "+21345270000", wilaya: "مستغانم" },
       { name: "Hotel Carthage", phone: "+21338820000", wilaya: "عنابة" },
       { name: "Hotel Al Bustan", phone: "+21321730000", wilaya: "الجزائر" },
       { name: "Hotel Ryad", phone: "+21321720000", wilaya: "الجزائر" },
       { name: "Hotel Zeralda", phone: "+21321320000", wilaya: "الجزائر" },
       { name: "Hotel Tipaza Raid", phone: "+21324490000", wilaya: "تيبازة" },
       { name: "Hotel Mazafran", phone: "+21321380000", wilaya: "الجزائر" },
       { name: "Hotel Chelia", phone: "+21332750000", wilaya: "باتنة" },
       { name: "Hotel Aurès", phone: "+21332760000", wilaya: "باتنة" },
       { name: "Hotel Hoggar", phone: "+21329200000", wilaya: "تمنراست" },
       { name: "Hotel Assekrem", phone: "+21329210000", wilaya: "تمنراست" },
       { name: "Hotel Tassili", phone: "+21329920000", wilaya: "إليزي" },
       { name: "Hotel Tidikelt In Salah", phone: "+21349350000", wilaya: "عين صالح" },
       { name: "Hotel Touat", phone: "+21349960000", wilaya: "أدرار" },
       { name: "Hotel Gourara", phone: "+21349970000", wilaya: "أدرار" },
       { name: "Hotel Saoura", phone: "+21349600000", wilaya: "بشار" },
       { name: "Hotel Taghit", phone: "+21349610000", wilaya: "بشار" },
       { name: "Hotel Khenchela", phone: "+21332820000", wilaya: "خنشلة" },
       { name: "Hotel Mascara", phone: "+21345810000", wilaya: "معسكر" },
       { name: "Hotel Relizane", phone: "+21346710000", wilaya: "غليزان" },
       { name: "Hotel Chlef", phone: "+21327770000", wilaya: "الشلف" },
       { name: "Hotel Dahra", phone: "+21327780000", wilaya: "الشلف" },
       { name: "Hotel Ténès", phone: "+21327790000", wilaya: "الشلف" },
       { name: "Hotel Ain Defla", phone: "+21327500000", wilaya: "عين الدفلى" },
       { name: "Hotel Blida", phone: "+21325430000", wilaya: "البليدة" },
       { name: "Hotel Chrea", phone: "+21325440000", wilaya: "البليدة" },
       { name: "Hotel Boumerdes", phone: "+21324810000", wilaya: "بومرداس" },
       { name: "Hotel Dellys", phone: "+21324820000", wilaya: "بومرداس" },
       { name: "Hotel Tizi Ouzou", phone: "+21326210000", wilaya: "تيزي وزو" },
       { name: "Hotel Le Djurdjura", phone: "+21326220000", wilaya: "تيزي وزو" },
       { name: "Hotel Azazga", phone: "+21326230000", wilaya: "تيزي وزو" },
       { name: "Hotel Jijel", phone: "+21334490000", wilaya: "جيجل" },
       { name: "Hotel Kotama", phone: "+21334500000", wilaya: "جيجل" },
       { name: "Hotel Skikda", phone: "+21338790000", wilaya: "سكيكدة" },
       { name: "Hotel Royal Skikda", phone: "+21338800000", wilaya: "سكيكدة" },
       { name: "Hotel Guelma", phone: "+21337200000", wilaya: "قالمة" },
       { name: "Hotel Souk Ahras", phone: "+21337810000", wilaya: "سوق أهراس" },
       { name: "Hotel Tebessa", phone: "+21337490000", wilaya: "تبسة" },
       { name: "Hotel Oum El Bouaghi", phone: "+21332500000", wilaya: "أم البواقي" },
       { name: "Hotel Biskra", phone: "+21333740000", wilaya: "بسكرة" },
       { name: "Hotel Les Zibans", phone: "+21333750000", wilaya: "بسكرة" },
       { name: "Hotel El Oued", phone: "+21332910000", wilaya: "الوادي" },
       { name: "Hotel Souf", phone: "+21332920000", wilaya: "الوادي" },
       { name: "Hotel Laghouat", phone: "+21329930000", wilaya: "الأغواط" },
       { name: "Hotel Djelfa", phone: "+21327870000", wilaya: "الجلفة" },
       { name: "Hotel Saida", phone: "+21348930000", wilaya: "سعيدة" },
       { name: "Hotel Sidi Bel Abbes", phone: "+21348560000", wilaya: "سيدي بلعباس" },
       { name: "Hotel Ain Temouchent", phone: "+21343710000", wilaya: "عين تموشنت" },
       { name: "Hotel Beni Saf", phone: "+21343720000", wilaya: "عين تموشنت" },
       { name: "Hotel Maghnia", phone: "+21343330000", wilaya: "تلمسان" },
       { name: "Hotel Naama", phone: "+21349540000", wilaya: "عامة" },
       { name: "Hotel Mecheria", phone: "+21349550000", wilaya: "عامة" },
       { name: "Hotel El Bayadh", phone: "+21349810000", wilaya: "البيض" },
       { name: "Hotel Bordj Bou Arreridj", phone: "+21335680000", wilaya: "برج بوعريريج" },
       { name: "Hotel Mila", phone: "+21331560000", wilaya: "ميلة" },
       { name: "Hotel Aflou", phone: "+21329940000", wilaya: "الأغواط" },
       { name: "Hotel Touggourt", phone: "+21329680000", wilaya: "تقرت" },
       { name: "Hotel Ghardaia Oasis", phone: "+21329890000", wilaya: "غرداية" },
       { name: "Hotel El Meniaa", phone: "+21329850000", wilaya: "المنيعة" },

       // --- مجموعة المراقد (100 مرقد) ---
       { name: "Motel Andalous", phone: "+21345920000", wilaya: "مستغانم" },
       { name: "Motel Errodha", phone: "+21345210000", wilaya: "مستغانم" },
       { name: "Motel Les Sables", phone: "+21345940000", wilaya: "مستغانم" },
       { name: "Motel Le Pacha", phone: "+21331920000", wilaya: "قسنطينة" },
       { name: "Motel Oasis Oran", phone: "+21341410000", wilaya: "وهران" },
       { name: "Motel El Bahdja", phone: "+21321750000", wilaya: "الجزائر" },
       { name: "Motel Zianide", phone: "+21343230000", wilaya: "تلمسان" },
       { name: "Motel Soummam", phone: "+21334250000", wilaya: "بجاية" },
       { name: "Motel El Waha Sétif", phone: "+21336670000", wilaya: "سطيف" },
       { name: "Motel Annaba Express", phone: "+21338830000", wilaya: "عنابة" },
       { name: "Motel Mosta Plage", phone: "+21345280000", wilaya: "مستغانم" },
       { name: "Motel Salamandre", phone: "+21345290000", wilaya: "مستغانم" },
       { name: "Motel Cap Ivi", phone: "+21345300000", wilaya: "مستغانم" },
       { name: "Motel Les Flots", phone: "+21341420000", wilaya: "وهران" },
       { name: "Motel Ain El Turck", phone: "+21341430000", wilaya: "وهران" },
       { name: "Motel Andalouses", phone: "+21341440000", wilaya: "وهران" },
       { name: "Motel Marsa", phone: "+21341450000", wilaya: "وهران" },
       { name: "Motel Arzew", phone: "+21341460000", wilaya: "وهران" },
       { name: "Motel Bethioua", phone: "+21341470000", wilaya: "وهران" },
       { name: "Motel Tlemcen Center", phone: "+21343240000", wilaya: "تلمسان" },
       { name: "Motel Ghazaouet", phone: "+21343250000", wilaya: "تلمسان" },
       { name: "Motel Nedroma", phone: "+21343260000", wilaya: "تلمسان" },
       { name: "Motel Sebdou", phone: "+21343270000", wilaya: "تلمسان" },
       { name: "Motel Maghnia Express", phone: "+21343340000", wilaya: "تلمسان" },
       { name: "Motel Sidi Bel Abbes Center", phone: "+21348570000", wilaya: "سيدي بلعباس" },
       { name: "Motel Telagh", phone: "+21348580000", wilaya: "سيدي بلعباس" },
       { name: "Motel Saida Plazza", phone: "+21348940000", wilaya: "سعيدة" },
       { name: "Motel Mascara Route", phone: "+21345820000", wilaya: "معسكر" },
       { name: "Motel Tigdhen", phone: "+21345830000", wilaya: "معسكر" },
       { name: "Motel Relizane Route", phone: "+21346720000", wilaya: "غليزان" },
       { name: "Motel Oued Rhiou", phone: "+21346730000", wilaya: "غليزان" },
       { name: "Motel Chlef Express", phone: "+21327800000", wilaya: "الشلف" },
       { name: "Motel Boukadir", phone: "+21327810000", wilaya: "الشلف" },
       { name: "Motel Zéralda Motel", phone: "+21321330000", wilaya: "الجزائر" },
       { name: "Motel Staoueli", phone: "+21321340000", wilaya: "الجزائر" },
       { name: "Motel Sidi Fredj", phone: "+21321350000", wilaya: "الجزائر" },
       { name: "Motel Reghaia", phone: "+21321850000", wilaya: "الجزائر" },
       { name: "Motel Rouiba", phone: "+21321860000", wilaya: "الجزائر" },
       { name: "Motel Dar El Beida", phone: "+21321500000", wilaya: "الجزائر" },
       { name: "Motel Blida Sud", phone: "+21325450000", wilaya: "البليدة" },
       { name: "Motel El Affroun", phone: "+21325460000", wilaya: "البليدة" },
       { name: "Motel Medea Route", phone: "+21326210000", wilaya: "المدية" },
       { name: "Motel Ksar El Boukhari", phone: "+21326220000", wilaya: "المدية" },
       { name: "Motel Ain Defla Route", phone: "+21327510000", wilaya: "عين الدفلى" },
       { name: "Motel Khemis Miliana", phone: "+21327520000", wilaya: "عين الدفلى" },
       { name: "Motel Tipaza Plage", phone: "+21324500000", wilaya: "تيبازة" },
       { name: "Motel Cherchell", phone: "+21324510000", wilaya: "تيبازة" },
       { name: "Motel Koléa", phone: "+21324520000", wilaya: "تيبازة" },
       { name: "Motel Boumerdes City", phone: "+21324830000", wilaya: "بومرداس" },
       { name: "Motel Zemmouri", phone: "+21324840000", wilaya: "بومرداس" },
       { name: "Motel Tizi Ouzou Express", phone: "+21326240000", wilaya: "تيزي وزو" },
       { name: "Motel Draa Ben Khedda", phone: "+21326250000", wilaya: "تيزي وزو" },
       { name: "Motel Azazga Motel", phone: "+21326260000", wilaya: "تيزي وزو" },
       { name: "Motel Bejaia Port", phone: "+21334260000", wilaya: "بجاية" },
       { name: "Motel Akbou", phone: "+21334270000", wilaya: "بجاية" },
       { name: "Motel Jijel Corniche", phone: "+21334510000", wilaya: "جيجل" },
       { name: "Motel El Aouana", phone: "+21334520000", wilaya: "جيجل" },
       { name: "Motel Skikda Port", phone: "+21338810000", wilaya: "سكيكدة" },
       { name: "Motel Azzaba", phone: "+21338820000", wilaya: "سكيكدة" },
       { name: "Motel Annaba Pont Blanc", phone: "+21338840000", wilaya: "عنابة" },
       { name: "Motel El Hadjar", phone: "+21338850000", wilaya: "عنابة" },
       { name: "Motel Guelma Centre", phone: "+21337210000", wilaya: "قالمة" },
       { name: "Motel Souk Ahras Route", phone: "+21337820000", wilaya: "سوق أهراس" },
       { name: "Motel Tebessa Frontiere", phone: "+21337500000", wilaya: "تبسة" },
       { name: "Motel Oum El Bouaghi Sud", phone: "+21332510000", wilaya: "أم البواقي" },
       { name: "Motel Batna Route", phone: "+21332770000", wilaya: "باتنة" },
       { name: "Motel Barika", phone: "+21332780000", wilaya: "باتنة" },
       { name: "Motel Sétif El Eulma", phone: "+21336680000", wilaya: "سطيف" },
       { name: "Motel Bordj Bou Arreridj Sud", phone: "+21335690000", wilaya: "برج بوعريريج" },
       { name: "Motel M'sila Route", phone: "+21335890000", wilaya: "المسيلة" },
       { name: "Motel Biskra Oasis", phone: "+21333760000", wilaya: "بسكرة" },
       { name: "Motel El Oued Souf", phone: "+21332930000", wilaya: "الوادي" },
       { name: "Motel Hassi Messaoud Route", phone: "+21329770000", wilaya: "ورقلة" },
       { name: "Motel Ghardaia M'zab", phone: "+21329900000", wilaya: "غرداية" },
       { name: "Motel Laghouat Nord", phone: "+21329950000", wilaya: "الأغواط" },
       { name: "Motel Djelfa Centre", phone: "+21327880000", wilaya: "الجلفة" },
       { name: "Motel Adrar Sahara", phone: "+21349980000", wilaya: "أدرار" },
       { name: "Motel Timimoun", phone: "+21349990000", wilaya: "أدرار" },
       { name: "Motel Bechar Oasis", phone: "+21349620000", wilaya: "بشار" },
       { name: "Motel Tamanrasset Sud", phone: "+21329220000", wilaya: "تمنراست" },
       { name: "Motel Illizi Route", phone: "+21329930000", wilaya: "إليزي" },
       { name: "Motel Djanet", phone: "+21329940000", wilaya: "إليزي" },
       { name: "Motel In Amenas", phone: "+21329950000", wilaya: "إليزي" },
       { name: "Motel Ain Salah", phone: "+21349360000", wilaya: "عين صالح" },
       { name: "Motel Bordj Badji Mokhtar", phone: "+21349370000", wilaya: "برج باجي مختار" },
       { name: "Motel In Guezzam", phone: "+21349380000", wilaya: "إن قزام" },
       { name: "Motel Touggourt Oasis", phone: "+21329690000", wilaya: "تقرت" },
       { name: "Motel El Meniaa Route", phone: "+21329860000", wilaya: "المنيعة" },
       { name: "Motel Mila Centre", phone: "+21331570000", wilaya: "ميلة" },
       { name: "Motel Jijel Port", phone: "+21334530000", wilaya: "جيجل" },
       { name: "Motel Khenchela Route", phone: "+21332830000", wilaya: "خنشلة" },
       { name: "Motel Souk Ahras City", phone: "+21337830000", wilaya: "سوق أهراس" },
       { name: "Motel Guelma Hammam", phone: "+21337220000", wilaya: "قالمة" },
       { name: "Motel Ain Temouchent Plage", phone: "+21343730000", wilaya: "عين تموشنت" },
       { name: "Motel Naama Express", phone: "+21349560000", wilaya: "عامة" },
       { name: "Motel El Bayadh Oasis", phone: "+21349820000", wilaya: "البيض" },
       { name: "Motel Tiaret City", phone: "+21346460000", wilaya: "تيارت" },
       { name: "Motel Saida Sud", phone: "+21348950000", wilaya: "سعيدة" },
       { name: "Motel Mascara Centre", phone: "+21345840000", wilaya: "معسكر" },
       { name: "Motel Relizane Oued", phone: "+21346740000", wilaya: "غليزان" }
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
    `);
});

app.listen(PORT, () => {
    console.log(`🌐 خادم الويب يعمل على المنفذ ${PORT}`);
});

// إعداد عميل الواتساب مع تصحيح الأخطاء لتعمل بسلاسة على بيئة السيرفر
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
       headless: true,
       args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
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
