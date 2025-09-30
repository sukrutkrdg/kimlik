// index.js

require('dotenv').config();
const mongoose = require('mongoose');

// Backend klasöründeki kimlik doğrulama scriptini import et
const verifyIdentity = require('./backend/verifyIdentity');

// MongoDB'ye bağlanma fonksiyonu (eğer veritabanı kaydı gerekirse kullanılacak)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı!');
    } catch (err) {
        console.error('MongoDB bağlantı hatası:', err.message);
        process.exit(1);
    }
};

// Uygulamayı başlat
const startApp = async () => {
    // MongoDB bağlantısını başlat
    // Şimdilik pasif, ancak ileride on-chain kayıt için kullanılacak
    // await connectDB(); 
    
    console.log("Farcaster Kimlik Çözümleyicisi scripti başlatılıyor...");

    // Örnek bir FID ve ENS adını kullanarak kimlik doğrulama işlemini başlat
    // Buradaki değerleri kendi test bilgilerine göre değiştirebilirsin
    const TEST_FID = 194; // Vitalik Buterin'in FID'si
    const TEST_ENS = 'vitalik.eth';

    const result = await verifyIdentity(TEST_FID, TEST_ENS);

    if (result) {
        console.log("\n-> Doğrulama başarıyla tamamlandı!");
    } else {
        console.log("\n-> Doğrulama başarısız oldu.");
    }
};

startApp();