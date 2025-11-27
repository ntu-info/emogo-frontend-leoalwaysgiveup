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
├── INTERACTION_HISTORY.md   # Human-AI 交互歷史
├── app.json
├── package.json
└── README.md
```

---

## 📊 作業要求

- [x] 情緒問卷功能（structured active data）
- [x] 1秒 Vlog 錄影功能（unstructured active data）
- [x] GPS 座標記錄功能（structured passive data）
- [x] 本地資料庫儲存（SQLite）
- [x] 數據導出功能
- [ ] 數據收集（每種類型 ≥3 筆，時間跨度 >12 小時）

---

## 📥 數據收集步驟

1. **現在開始收集**
   - 記錄情緒問卷
   - 錄製 1 秒 Vlog
   - 記錄 GPS 位置

2. **12+ 小時後再收集**
   - 重複以上步驟

3. **導出數據**
   - 前往「設定」頁面
   - 點擊「導出所有數據」
   - 將 JSON 檔案放入 `data/` 資料夾

---

## 👤 作者

GitHub Classroom Assignment - Psychoinformatics & Neuroinformatics
