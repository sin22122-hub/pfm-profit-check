# PFM V21.7 Width & PDF Fix

## 已修正
- 全站大區塊寬度統一，以 Hero 寬度為唯一標準。
- PFM 顧問摘要寬度修正，與 Hero / 章節 / 隱形成本一致。
- 免費解鎖區塊寬度修正，與 Hero / 章節 / 隱形成本一致。
- PDF 列印時隱藏網站 Header，避免封面頁出現導覽列。
- PDF 90 天改善路徑修正：標題與內文不再被壓成直排。
- PDF 頁面高度微調，降低封面後多出空白頁的機率。

## 未調整
- Google Sheet 評分公式與雷達圖邏輯未動；保留到 V22 評分引擎重構。

## 安裝提醒
這版不附 package-lock.json，請在本機重新執行：

```bash
npm install
npm run dev
```
