# Travel Plan 🧭

一個和朋友共享旅行行程的小網站。把集合時間、景點、交通、餐廳、預算與雨天備案集中在同一頁，出遊時用手機就能快速查看。

*A shared collection of itineraries for trips with friends — built for easy viewing on mobile.*

## 🌏 旅行行程

| 目的地 | 日期 | 人數 | 行程 |
| --- | --- | --- | --- |
| 🇯🇵 東京・上野（Ueno） | 2026/10/25（日） | 7 人 | [開啟互動行程](https://brianlu11.github.io/Travel_Plan/ueno-trip/) |
| 🇯🇵 川越・秩父・長瀞 | 2026/10/31–11/3 | 人數可調 | [開啟四天三夜行程](https://brianlu11.github.io/Travel_Plan/chichibu-kawagoe/) |

**[旅行計畫總首頁 →](https://brianlu11.github.io/Travel_Plan/)**

**上野集合資訊：2026/10/25（日）10:30，JR 上野站公園口（建議 10:20 抵達）。**

> 上述網址透過 GitHub Pages 提供；若尚未啟用 Pages 或部署未完成，可先閱讀下方原始檔案。

## ✨ 網站功能

- 📱 **手機優先**：方便旅伴隨時查閱。
- ☀️🌦️🌧️ **晴天／小雨／雨天方案**：依現場天氣切換行程。
- 🕒 **互動時間軸**：清楚顯示集合、用餐與參觀時段。
- 🗺️ **地圖與導航**：快速開啟景點的 Google Maps。
- 🍽️ **聚餐資訊**：適合團體的午晚餐備選方案。
- 💴 **預算估算與行前清單**：減少臨時找資料的時間。

## 📁 專案結構

```text
Travel_Plan/
├── index.html           # 所有旅程的入口首頁
├── README.md
└── ueno-trip/
    ├── index.html       # 上野七人一日遊
    ├── app.js           # 行程切換及互動功能
    ├── styles.css       # 網頁樣式
    └── favicon.svg      # 網站圖示
└── chichibu-kawagoe/
    ├── index.html       # 四日切換及候選選項
    ├── app.js           # 每日時程、天氣、預算與日曆
    ├── styles.css       # 延續上野頁設計風格
    └── favicon.svg
```

## 🚀 使用與更新

本站是 **HTML + CSS + JavaScript** 靜態網站，不需要安裝 Node.js 或額外套件。可以直接打開 `index.html` 查看；公開分享則使用 GitHub Pages。

新增旅行時，建立新資料夾（例如 `kawagoe-trip/`），放入 `index.html` 等檔案，再在根目錄 `index.html` 加入該行程入口。

GitHub Pages 設定：**Settings → Pages → Deploy from a branch → `main` / `(root)`**。之後推送到 `main` 的變更會由 GitHub Pages 重新部署。

## 📌 出發前提醒

行程時間、餐廳座位、展覽場次與天氣可能變動；請以景點和店家的當日公告為準，尤其團體訂位務必事先確認。

---

Made for shared journeys. · [GitHub Repository](https://github.com/BrianLu11/Travel_Plan)
