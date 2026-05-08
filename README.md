# 💊 İlaç Takip Sistemi (Medicine Tracking App)

Bu proje, ilaç kullanım saatlerini, dozajlarını ve kayıtlarını takip edebileceğimiz basit, hızlı ve şık bir full-stack web uygulamasıdır. 

Proje, ekiplerin birbirini ezmeden rahatça çalışabilmesi için **Frontend** ve **Backend** olarak iki tamamen bağımsız klasöre ayrılmıştır.

## 🛠 Teknoloji Yığını (Tech Stack)

**Frontend:**
* React (Vite ile oluşturuldu)
* Tailwind CSS (Hızlı ve modern UI tasarımı için)

**Backend:**
* Node.js & Express.js (REST API)
* SQLite (`better-sqlite3` - Sıfır kurulum gerektiren lokal veritabanı)

---

## 🚀 Başlangıç ve Kurulum (Getting Started)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla izleyin. 
*(Bilgisayarınızda **Node.js** ve **Git** yüklü olmalıdır.)*

### 1. Repoyu Klonlayın
Öncelikle projeyi bilgisayarınıza indirin ve ana klasöre girin:

git clone [https://github.com/AtalaBaris/medicine-tracking-app.git](https://github.com/AtalaBaris/medicine-tracking-app.git)
cd medicine-tracking-app

2. Backend'i Ayağa Kaldırın (API & Veritabanı)
Backend klasörüne girip gerekli paketleri yükleyin ve sunucuyu başlatın:

cd backend
npm install
npm run dev

3. Frontend'i Ayağa Kaldırın (Arayüz)
Yeni bir terminal penceresi açın (backend terminalini kapatmayın), ana dizinden frontend klasörüne girin:

cd frontend
npm install
npm run dev

📁 Klasör Yapısı ve Geliştirme Kuralları
Projeyi spagetti koda çevirmemek için lütfen aşağıdaki yapıya sadık kalın:

Frontend Yapısı (frontend/src/)
/components: Sadece tekrar kullanılacak küçük parçalar (Buton, Input, Navbar, Modal vb.) buraya gelecek.

/pages: Ana sayfalarımız (LoginPage, Dashboard vb.) burada olacak.

/services: Backend API'sine (localhost:3000) atılacak tüm fetch/axios istekleri buradaki api.js içinde yazılacak.

/utils: Tarih formatlama gibi yardımcı JS fonksiyonları.

Backend Yapısı (backend/)
/config/database.js: SQLite bağlantı ayarları burada.

/controllers/: Veritabanı işlemleri ve gelen istekleri (req, res) işlediğimiz fonksiyonlar.

/routes/: Express URL yönlendirmeleri (Endpoint'ler).

index.js: Sadece sunucuyu başlatan ana dosyamız.

🤝 Git Kullanım Kuralları
Lütfen doğrudan main branch'ine kod pushlamayın.

Kendi üzerinde çalıştığınız özellik için yeni bir branch açın (git checkout -b frontend-login-sayfasi gibi).

İşiniz bittiğinde GitHub üzerinden Pull Request (PR) açın.

Herkese iyi kodlamalar! 🚀
