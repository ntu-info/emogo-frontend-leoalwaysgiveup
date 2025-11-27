# EmoGo - 情緒追蹤 App

## 🔗 App URI

**Expo App Link:** https://emogo-app--9r0it7qey8.expo.app

> ⚠️ 部署後請更新此連結

---

## 📱 App 功能

EmoGo 是一個情緒追蹤應用程式，包含三種數據收集功能：

| 功能 | 說明 | 數據類型 |
|------|------|---------|
| 😊 **情緒問卷** | 簡單的情緒調查（心情、精力、壓力） | structured active/foreground |
| 📹 **1秒 Vlog** | 錄製 1 秒影片記錄此刻 | unstructured active/foreground |
| 📍 **GPS 定位** | 記錄位置座標 (lat, lng) | structured passive/background |

---

## 📦 使用的套件

```
expo-sqlite          → 本地資料庫
expo-camera          → 錄影功能
expo-location        → GPS 定位
expo-file-system     → 檔案儲存
expo-sharing         → 導出數據
expo-notifications   → 通知提醒（可選）
```

---

## 🚀 如何執行

1. 安裝相依套件：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npx expo start
   ```

3. 在手機上使用 Expo Go 掃描 QR code

---

## 📁 專案結構

```
├── app/
│   ├── _layout.js           # 根層導航
│   ├── index.js             # 進入點
│   └── (tabs)/
│       ├── _layout.js       # Tabs 導航
│       ├── index.js         # 😊 情緒問卷頁
│       ├── vlog.js          # 📹 Vlog 錄影頁
│       ├── location.js      # 📍 GPS 定位頁
│       └── settings.js      # ⚙️ 設定 & 導出頁
├── utils/
│   └── database.js          # SQLite 資料庫工具
├── data/                    # 導出的數據資料夾
├── cursor_emochat.md   # 聊天記錄
├── app.json
├── package.json
└── README.md
```


