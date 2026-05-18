# MedTrack Pro – Frontend

React + Vite + Tailwind CSS uygulaması.

## Kurulum

```bash
cd medtrack-pro
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

---

## Klasör Yapısı

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx    # Tüm app sayfaları için shell (SideNav + TopBar + BottomNav)
│   │   ├── SideNav.jsx      # Masaüstü sol navigasyon
│   │   ├── TopBar.jsx       # Mobil üst bar
│   │   └── BottomNav.jsx    # Mobil alt navigasyon
│   └── ui/
│       ├── button.jsx       # Genel Button bileşeni (primary/secondary/ghost/danger)
│       └── MedCard.jsx      # İlaç kartı (default/low-stock/as-needed varyantları)
│
├── pages/
│   ├── loginPage/
│   │   └── loginpage.jsx    # Giriş sayfası
│   ├── registerPage/
│   │   └── RegisterPage.jsx # Kayıt sayfası
│   ├── dashboard/
│   │   └── Dashboard.jsx    # Ana panel
│   ├── medications/
│   │   └── Medications.jsx  # İlaç listesi
│   ├── addMedication/
│   │   └── AddMedication.jsx# Yeni ilaç ekleme formu
│   ├── reports/
│   │   └── Reports.jsx      # Raporlar & analitik
│   └── settings/
│       └── Settings.jsx     # Ayarlar
│
├── services/
│   └── api.js               # Backend API çağrıları
│
├── utils/
│   └── formatters.js        # Yardımcı fonksiyonlar
│
├── App.jsx                  # Router tanımları
├── main.jsx                 # React giriş noktası
└── index.css                # Tailwind + Google Fonts imports
```

---

## Navigasyon

| Route              | Bileşen         | Nav Shell |
|--------------------|-----------------|-----------|
| `/login`           | LoginPage       | Yok       |
| `/register`        | RegisterPage    | Yok       |
| `/dashboard`       | Dashboard       | Var       |
| `/medications`     | Medications     | Var       |
| `/add-medication`  | AddMedication   | Sadece kendi header'ı |
| `/reports`         | Reports         | Var       |
| `/settings`        | Settings        | Var       |

---

## Özelleştirme

- **Renkler / spacing / font**: `tailwind.config.js`
- **Global stiller**: `src/index.css`
- **API URL**: `.env` dosyasında `VITE_API_URL=http://your-backend.com/api`
