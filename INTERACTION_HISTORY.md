# Human-AI Interaction History

本文件記錄開發 EmoGo App 過程中與 AI 助手（Claude）的交互歷史。

---

## 📅 開發時間軸

**日期：** 2024/11/26 - 2024/11/27

**截止時間：** 2024/11/27 23:59

---

## 🗣️ 交互記錄

### Session 1 - 理解作業要求

**Human:** 告訴我這份作業要求

**AI:** 整理出作業要求：
- 在 README.md 中加入 Expo app URI
- 提交 RN 源代碼 + Human-AI interaction history 文件  
- 創建 data 資料夾，存放導出數據（每種數據類型 ≥ 3 筆，時間差 > 12 小時）

---

### Session 2 - 初步建立專案結構

**Human:** 請幫我完成所有要求

**AI:** 協助完成：
1. 更新 README.md
2. 創建基本的數據記錄功能
3. 建立 data 資料夾結構

**問題：** 發現原始專案只是導航範例，沒有實際功能

---

### Session 3 - 部署測試

**Human:** 執行部署指令

**AI:** 協助處理部署問題：
- 修正 app.json 中的 owner 和 projectId
- 使用 `npx eas-cli init` 創建新專案
- 成功部署到：https://emogo-app--4kf6yykw4v.expo.app

---

### Session 4 - 發現真正的作業要求

**Human:** 提供課程簡報內容

**AI:** 發現作業實際要求是做 **EmoGo 情緒追蹤 App**，需要：
- 情緒問卷（structured active data）
- 1秒 Vlog 錄影（unstructured active data）
- GPS 座標（structured passive data）

**決定：** 重新開發完整的 EmoGo App

---

### Session 5 - 重新開發 App

**AI 協助完成：**

1. **更新 package.json**
   - 加入所需套件：expo-sqlite, expo-camera, expo-location, expo-sharing

2. **創建 `utils/database.js`**
   - 實作 SQLite 資料庫工具
   - 支援 Web (localStorage) 和 Native (SQLite)

3. **修改頁面結構**
   - `app/(tabs)/index.js` - 情緒問卷頁面（心情、精力、壓力）
   - `app/(tabs)/vlog.js` - 1秒 Vlog 錄影頁面
   - `app/(tabs)/location.js` - GPS 定位頁面
   - `app/(tabs)/settings.js` - 設定 & 數據導出頁面

---

### Session 6 - 解決套件版本問題

**問題：** npm install 失敗，套件版本不存在

**解決方案：** 
- 修正 package.json 中的套件版本
- 重新安裝成功

---

### Session 7 - 處理 SQLite Web 兼容問題

**問題：** Web 版本無法使用 expo-sqlite

**解決方案：**
- 修改 `utils/database.js` 檢測平台
- Web 使用 localStorage
- Native 使用 SQLite

---

### Session 8 - 解決手機連接問題

**問題：** 
- Expo Go 掃描 QR code 沒反應
- 手機無法連接到本地開發伺服器

**嘗試的解決方案：**
1. LAN 模式 - 失敗
2. Tunnel 模式 - ngrok 安裝問題
3. 手動輸入 URL - 失敗

**最終解決方案：** 直接部署到 Expo 雲端，用瀏覽器訪問

---

### Session 9 - 實現 Web 相機錄影功能

**問題：** Web 版本需要支援相機錄影

**解決方案：**
- 修改 `vlog.js` 使用 `navigator.mediaDevices.getUserMedia`
- 實作 Web 版本的相機錄影功能
- 支援 1 秒自動停止錄影

---

### Session 10 - 解決瀏覽器權限問題

**問題：** Chrome 無法使用相機和 GPS

**解決方案：** 指導用戶在 Chrome 設定中授予相機和位置權限

---

### Session 11 - 數據收集與導出

**過程：**
1. 用戶在 App 中收集數據（情緒、Vlog、GPS）
2. 等待超過 12 小時
3. 再次收集數據
4. 使用「導出數據」功能下載 JSON

**結果：**
- 情緒問卷：10 筆，15.8 小時 ✅
- 1秒 Vlog：12 筆，15.68 小時 ✅
- GPS 座標：18 筆，15.67 小時 ✅

---

### Session 12 - 最終提交準備

**完成項目：**
- 更新 README.md 加入新的 App URL
- 創建 INTERACTION_HISTORY.md（本文件）
- 清理不必要的檔案
- 準備推送到 GitHub

---

## 🔧 技術問題與解決方案總結

| 問題 | 解決方案 |
|------|---------|
| 套件版本不匹配 | 修正 package.json 版本號 |
| SQLite 不支援 Web | 實作雙平台支援（localStorage + SQLite）|
| 手機無法連接 | 部署到雲端，用瀏覽器訪問 |
| Web 相機功能 | 使用 `navigator.mediaDevices.getUserMedia` |
| 瀏覽器權限問題 | 指導用戶授予權限 |

---

## 💡 學習心得

透過與 AI 助手的協作，完成了以下學習：

1. **Expo Router** - 學習 file-based routing 的使用方式
2. **跨平台開發** - 理解 Web 和 Native 的差異與處理方式
3. **數據庫設計** - 實作本地數據儲存和導出功能
4. **權限管理** - 處理相機、位置等敏感權限
5. **問題解決** - 遇到問題時如何尋找替代方案

### AI 協助的價值

- **快速原型開發** - 短時間內建立完整 App
- **問題診斷** - 快速找出錯誤原因並提供解決方案
- **知識補充** - 提供套件使用方式和最佳實踐

---

## 📊 最終成果

- **App URL:** https://emogo-app--9r0it7qey8.expo.app
- **GitHub Repo:** https://github.com/ntu-info/emogo-frontend-leoalwaysgiveup
- **開發時間：** 約 6-8 小時（含等待數據收集時間）
- **程式碼行數：** 約 1500+ 行

---

## 🙏 致謝

感謝 Claude AI (Cursor IDE) 在開發過程中的協助，讓我能夠：
- 快速理解作業要求
- 有效率地完成開發
- 解決各種技術問題

---

*本文件由 Human-AI 協作完成*  
*日期：2024/11/27*

