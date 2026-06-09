const form = document.querySelector("#toolForm");
const resultBox = document.querySelector("#resultBox");
const copyButton = document.querySelector("#copyResult");
const templateOutput = document.querySelector("#templateOutput");

const templates = {
  intern: {
    title: "實習申請包",
    body: "履歷一頁版、自傳 800 字版、Cover Letter、面試自我介紹、追蹤信。"
  },
  exchange: {
    title: "交換學生包",
    body: "讀書計畫、選校理由、英文自我介紹、經費規劃表、返國貢獻段落。"
  },
  grad: {
    title: "研究所推甄包",
    body: "研究動機、備審資料目錄、專題摘要、教授聯絡信、面試問答庫。"
  },
  scholarship: {
    title: "獎學金申請包",
    body: "申請清單、自傳模板、成績說明、弱勢或特殊經歷陳述、送件檢查表。"
  }
};

const sample = {
  major: "你的科系與年級",
  goal: "這次申請目標",
  experience: "課程、專題、打工、社團、競賽或證照"
};

function value(id) {
  const raw = document.querySelector(id).value.trim();
  return raw || sample[id.slice(1)];
}

function bulletize(text) {
  return text
    .split(/[，,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function generateResume(major, goal, experience) {
  const items = bulletize(experience);
  const bullets = items.length ? items : ["完成課程專題", "參與團隊合作", "整理資料並提出改善建議"];
  return `實習履歷條列初稿

申請目標：${goal}
背景定位：${major}

可放入履歷的經歷描述：
${bullets.map((item) => `- 將「${item}」整理為具體成果，強調任務、方法與可量化影響。`).join("\n")}

履歷摘要範例：
具備 ${major} 背景，正在申請 ${goal}。曾透過課程、專題或實務經驗累積資料整理、溝通協作與問題分析能力，能在明確目標下完成任務並持續優化成果。

下一步：
- 把每一條補上數字，例如人數、金額、週期、成效。
- 刪掉無法證明的形容詞，改成具體行動。
- 一頁履歷只保留最貼近 ${goal} 的經歷。`;
}

function generateBio(major, goal, experience) {
  return `自傳大綱初稿

第一段：背景與申請動機
我是 ${major}，這次申請 ${goal}。過去的學習與經歷讓我開始關注這個方向，並希望透過這次機會累積更完整的實務能力。

第二段：能力證據
我曾經參與或完成：${experience}。這些經驗讓我練習資料整理、時間管理、團隊溝通與問題拆解，也讓我更理解自己適合的工作方式。

第三段：與申請目標的連結
${goal} 需要的不只是興趣，也需要穩定執行與學習能力。我希望把目前累積的基礎帶進新的環境，並在實際任務中補足不足。

第四段：未來規劃
若有機會錄取，我會先熟悉制度與任務，再主動整理學習紀錄，將成果回饋到後續課業、職涯或校內分享。`;
}

function generateEmail(major, goal, experience) {
  return `教授推薦信邀請信範例

主旨：推薦信邀請 - ${major} 學生申請 ${goal}

教授您好：

我是 ${major} 的學生。近期我準備申請 ${goal}，想請問老師是否方便為我撰寫推薦信。

我整理了這次申請需要的資訊，包含申請目標、截止日期、履歷、自傳草稿，以及我過去與課程或專題相關的經歷：${experience}。

若老師願意協助，我會將所有資料整理成一份文件寄給您，並標註推薦信提交方式與期限，盡量減少老師額外整理的時間。

謝謝老師撥冗閱讀，也理解老師行程繁忙。若這次時間不方便，也完全沒有問題。

敬祝 平安順心
你的姓名`;
}

function generateScholarship(major, goal, experience) {
  return `獎學金申請檢查清單

申請人背景：${major}
申請項目：${goal}

基本文件：
- 申請表
- 學生證或在學證明
- 成績單
- 自傳或申請動機
- 相關證明文件

加分材料：
- ${experience}
- 競賽、服務、社團、專題或打工證明
- 家庭或特殊狀況說明
- 老師、主管或導師推薦

送出前檢查：
- 所有檔名格式一致
- 截止日期與送件方式確認
- 自傳有連回獎學金宗旨
- 證明文件順序與目錄一致
- PDF 開啟正常，沒有缺頁或模糊掃描`;
}

function generateExchange(major, goal, experience) {
  return `交換學生讀書計畫初稿

一、申請動機
我是 ${major}，希望透過 ${goal} 拓展專業視野與跨文化溝通能力。過去的學習經驗讓我意識到，只在原本環境中學習仍有侷限，因此期待到不同教育環境中比較課程、方法與產業觀點。

二、過去準備
目前我已累積以下經驗：${experience}。這些經驗讓我具備基本的自我管理、團隊合作與問題解決能力，也能支持我在交換期間適應新的課業節奏。

三、課程與學習規劃
交換期間，我會優先選修與本科系及未來職涯相關的課程，並記錄課程內容、報告方法與小組合作模式，作為返國後延伸學習的基礎。

四、返國後規劃
返國後，我會將交換期間的課程心得與申請經驗整理成分享資料，提供給同系或有意申請交換的同學參考。`;
}

function generateEnglish(major, goal, experience) {
  const items = bulletize(experience);
  const bullets = items.length ? items : ["course project", "team activity", "part-time work"];
  return `英文履歷用語轉換

Profile:
${major} student seeking ${goal}, with hands-on experience in academic projects, teamwork, and structured problem solving.

Action verbs:
- Analyzed
- Coordinated
- Developed
- Organized
- Presented
- Improved

Bullet drafts:
${bullets.map((item) => `- Organized and improved ${item} by clarifying tasks, tracking progress, and presenting outcomes to stakeholders.`).join("\n")}

Cover letter sentence:
I am interested in ${goal} because it matches my academic background in ${major} and my experience with ${experience}.`;
}

function generate(type, major, goal, experience) {
  const map = {
    resume: generateResume,
    bio: generateBio,
    email: generateEmail,
    scholarship: generateScholarship,
    exchange: generateExchange,
    english: generateEnglish
  };
  return map[type](major, goal, experience);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = document.querySelector("#toolType").value;
  resultBox.textContent = generate(type, value("#major"), value("#goal"), value("#experience"));
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultBox.textContent);
  copyButton.textContent = "已複製";
  window.setTimeout(() => {
    copyButton.textContent = "複製結果";
  }, 1200);
});

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = templates[button.dataset.template];
    templateOutput.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p>`;
  });
});
