# PFM V21.5 Quality Fix

## 已修正
- PFM 顧問摘要寬度改為與主要章節一致。
- 免費解鎖 CTA 寬度與主要章節一致，並再次收斂高度。
- 第一章～第四章的 PFM 顧問解讀區塊改為 100% 寬度，與上方卡片對齊。
- 三大問題／三大優勢改為「摘要、風險／放大、第一步」三段式，不再出現 label 與文字間距過大的問題。
- 毛利率、淨利率、回流率、廣告、金流等問題的顧問文案已拆開，不再共用同一段說明。
- 前端新增 V21.5 綜合分數計算，讓分數、成長階段與雷達圖一致。
- PDF 改為專用 A4 列印報告區塊，不再直接列印整個網頁畫面。

## Build 驗證
- `npm install` 成功
- `npm run build` 成功

## Google Sheet 是否需要同步修正？
需要。前端已先用 V21.5 公式修正顯示結果，但若 Google Sheet 的 Dashboard_Data / Client_Report / Consultant_Report 仍使用舊公式，後台資料會與網站畫面不一致。

建議將 Dashboard_Data 中的綜合分數與成長階段改為以下權重：

- 獲利能力：40%
- 客戶經營：25%
- 流量內容：15%
- 轉換能力：10%
- 品牌／數位成熟：10%

## Google Sheet 公式模板

> 下方公式中的 `毛利率儲存格`、`淨利率儲存格`、`金流手續費率儲存格` 等，請替換成你目前 Dashboard_Data 實際對應的儲存格。
> 公式會自動處理 20% 或 20 兩種格式。

### 1. 高越好分數函數模板
```gs
=LET(x,IF(指標儲存格<1,指標儲存格*100,指標儲存格),poor,40,caution,60,good,70,excellent,80,MAX(0,MIN(100,IFS(x>=excellent,92+(x-excellent)*0.5,x>=good,75+((x-good)/(excellent-good))*17,x>=caution,50+((x-caution)/(good-caution))*25,x>=poor,25+((x-poor)/(caution-poor))*25,TRUE,(x/MAX(poor,1))*25))))
```

### 2. 低越好分數函數模板
```gs
=LET(x,IF(指標儲存格<1,指標儲存格*100,指標儲存格),excellent,1.5,good,3,caution,5,weak,8,MAX(0,MIN(100,IFS(x<=excellent,95,x<=good,75+((good-x)/(good-excellent))*20,x<=caution,50+((caution-x)/(caution-good))*25,x<=weak,25+((weak-x)/(weak-caution))*25,TRUE,25-(x-weak)/MAX(weak,1)*20))))
```

### 3. Dashboard_Data 建議公式

#### B46｜獲利能力分數
```gs
=ROUND(毛利率分數*45%+淨利率分數*45%+金流手續費率分數*10%,0)
```

#### B47｜客戶經營分數
```gs
=ROUND(回流率分數*45%+介紹客比例分數*25%+客戶經營力分數*30%,0)
```

#### B48｜流量內容分數
```gs
=ROUND(AVERAGE(社群經營度分數,內容執行力分數,數位成熟度分數),0)
```

#### B49｜轉換能力分數
```gs
=ROUND(ROAS分數*45%+CPA分數*35%+金流手續費率分數*20%,0)
```

#### B50｜新版綜合分數
```gs
=ROUND(B46*40%+B47*25%+B48*15%+B49*10%+數位成熟度分數*10%,0)
```

#### B51｜新版成長階段
```gs
=IFS(B50>=85,"擴張期",B50>=70,"優化期",B50>=55,"建構期",B50>=40,"修復期",TRUE,"重整期")
```

## V21.5 前端目前採用的判定
- 85 分以上：擴張期
- 70～84：優化期
- 55～69：建構期
- 40～54：修復期
- 39 以下：重整期
