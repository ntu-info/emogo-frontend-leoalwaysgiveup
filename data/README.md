# Data 資料夾

此資料夾存放從 EmoGo App 導出的數據。

---

## 📊 數據類型

| 類型 | 說明 | 作業要求 |
|------|------|---------|
| `mood_entries` | 情緒問卷記錄 | structured active/foreground data |
| `vlog_entries` | 1秒 Vlog 記錄 | unstructured active/foreground data |
| `location_entries` | GPS 座標記錄 | structured passive/background data |

---

## ✅ 作業要求

每種數據類型需要：
- **≥ 3 筆記錄**
- **時間跨度 > 12 小時**（Tlast - T1st > 12 hours）

---

## 📥 如何取得數據

1. 在 App 中收集數據（每種類型至少 3 次，間隔超過 12 小時）
2. 前往「設定」頁面
3. 確認統計顯示符合要求
4. 點擊「📥 導出所有數據」
5. 將下載的 JSON 檔案放入此資料夾

---

## 📝 檔案格式

導出的 JSON 檔案包含：

```json
{
  "exportedAt": "2024-11-27T...",
  "appName": "EmoGo",
  "mood_entries": {
    "dataType": "sentiment_questionnaire",
    "records": [...],
    "metadata": { "count": 3, "timeSpanHours": 12.5 }
  },
  "vlog_entries": {
    "dataType": "one_second_vlog",
    "records": [...],
    "metadata": { ... }
  },
  "location_entries": {
    "dataType": "gps_coordinates",
    "records": [...],
    "metadata": { ... }
  }
}
```

---

*請在此資料夾放入導出的 JSON 檔案後再提交作業*
