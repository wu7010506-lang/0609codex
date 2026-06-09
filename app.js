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

const defaults = {
  major: "大學生",
  goal: "實習或申請項目",
  experience: "課程專題、社團活動、打工經驗",
  skills: "資料整理、簡報、團隊合作",
  metric: "完成一份報告或活動"
};

const actionVerbs = {
  data: ["分析", "整理", "視覺化", "比較"],
  service: ["接待", "協助", "回覆", "處理"],
  project: ["規劃", "製作", "測試", "改善"],
  leadership: ["協調", "分工", "追蹤", "帶領"],
  writing: ["撰寫", "彙整", "簡報", "呈現"]
};

function getValue(id) {
  const element = document.querySelector(id);
  const raw = element ? element.value.trim() : "";
  return raw || defaults[id.slice(1)];
}

function splitItems(text) {
  return text
    .split(/[，,、；;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function classify(item) {
  if (/資料|數據|問卷|excel|python|分析|統計/i.test(item)) return "data";
  if (/打工|服務|客人|客服|接待|店|餐/i.test(item)) return "service";
  if (/社團|活動|系學會|隊|合作|幹部/i.test(item)) return "leadership";
  if (/報告|自傳|文案|簡報|企劃|提案/i.test(item)) return "writing";
  return "project";
}

function chooseVerb(item, index = 0) {
  const verbs = actionVerbs[classify(item)];
  return verbs[index % verbs.length];
}

function normalizeMetric(metric) {
  if (!metric || metric === defaults.metric) return "留下可被檢查的成果";
  return metric;
}

function generateResume({ major, goal, experience, skills, metric }) {
  const items = splitItems(experience);
  const skillItems = splitItems(skills);
  const result = normalizeMetric(metric);
  const bullets = items.map((item, index) => {
    const verb = chooseVerb(item, index);
    const skill = skillItems[index % skillItems.length] || "資料整理";
    return `- ${verb}${item}，運用${skill}完成任務，並以「${result}」作為成果證據。`;
  });

  const stronger = items.map((item, index) => {
    const verb = chooseVerb(item, index);
    return `- ${verb}${item}：先釐清目標與限制，再整理執行步驟，最後用數字、作品或回饋證明成果。`;
  });

  return `履歷條列改寫結果

申請目標：${goal}
背景定位：${major}
建議主軸：把「我做過什麼」改成「我如何完成任務，並產生什麼證據」。

可直接放入履歷的版本：
${bullets.join("\n")}

如果你還沒有明確數字，先用這個更保守的版本：
${stronger.join("\n")}

履歷摘要：
${major}，正在申請 ${goal}。具備${skillItems.slice(0, 3).join("、")}等基礎能力，曾透過${items.slice(0, 3).join("、")}累積執行與整理經驗，能在明確目標下完成任務並回報成果。

下一步：
- 把「${result}」改成真正數字，例如份數、人數、週期、排名、金額或回饋。
- 每條履歷控制在 35-55 字。
- 刪掉不能被證明的形容詞，例如認真、積極、負責。`;
}

function scoreText(text) {
  const checks = [
    { name: "有明確申請目標", pass: /申請|實習|交換|獎學金|研究所|職位|目標/.test(text) },
    { name: "有具體行動", pass: /分析|規劃|協助|完成|製作|整理|撰寫|協調|改善|設計|執行/.test(text) },
    { name: "有成果或數字", pass: /\d|人|份|%|名|週|月|元|次|篇|場/.test(text) },
    { name: "有技能或工具", pass: /Excel|Python|簡報|英文|問卷|資料|Canva|Notion|GitHub|SQL|PowerPoint/i.test(text) },
    { name: "沒有過度空泛", pass: !/受益良多|學到很多|拓展視野|認真負責|積極學習/.test(text) },
    { name: "長度足夠", pass: text.length >= 120 }
  ];
  const passed = checks.filter((item) => item.pass).length;
  return { checks, score: Math.round((passed / checks.length) * 100) };
}

function generateChecker({ goal, experience }) {
  const text = `${goal}\n${experience}`.trim();
  const { checks, score } = scoreText(text);
  const failed = checks.filter((item) => !item.pass);
  const advice = failed.length
    ? failed.map((item) => `- 補強：${item.name}`).join("\n")
    : "- 結構已經不錯，下一步是壓字數與加入更貼近申請單位的關鍵詞。";

  return `申請文件健檢

分數：${score}/100

檢查結果：
${checks.map((item) => `${item.pass ? "✓" : "✗"} ${item.name}`).join("\n")}

優先修改：
${advice}

改寫原則：
- 每一段都要回答「我做了什麼、怎麼做、結果是什麼」。
- 空泛句改成具體證據，例如把「學到很多」改成「完成 12 頁分析報告並在小組簡報中負責結論段落」。
- 如果是自傳，第一段要連到申請目標；如果是履歷，每條都要有動詞開頭。`;
}

function generateBio({ major, goal, experience, skills, metric }) {
  const items = splitItems(experience);
  const skillItems = splitItems(skills);
  return `自傳段落規劃

申請目標：${goal}
身份定位：${major}

第一段：我為什麼申請
我是 ${major}，這次申請 ${goal}。我不是只因為感興趣而申請，而是因為過去在「${items[0] || experience}」中，開始接觸到${skillItems[0] || "資料整理"}與問題拆解，發現自己想把這些能力放到更實際的環境中驗證。

第二段：我有什麼證據
我曾經參與 ${items.slice(0, 3).join("、")}。這些經驗讓我練習${skillItems.slice(0, 4).join("、")}，也讓我理解完成任務不只需要想法，還需要把流程拆清楚、準時交付，並留下像「${normalizeMetric(metric)}」這樣可被檢查的成果。

第三段：我和申請單位的連結
${goal} 需要穩定學習、溝通與執行能力。我的優勢不是經驗很多，而是能從有限經驗中整理方法，並把任務轉成可追蹤的步驟。

第四段：錄取後規劃
若有機會錄取，我會先熟悉任務要求，再主動記錄學習過程與成果，將這次經驗延伸到後續課業、職涯規劃或校內分享。

提醒：
- 這是段落骨架，不要整段原封不動送出。
- 把每段第一句改成更像你自己的語氣。
- 至少加入一個真實事件，讓內容不像通用模板。`;
}

function generateEmailPack({ major, goal, experience, skills, metric }) {
  const deadline = metric.includes("/") || metric.includes("截止") ? metric : "請填入截止日期";
  return `推薦信資料包

一、寄給教授的信
主旨：推薦信邀請 - ${major} 申請 ${goal}

教授您好：

我是 ${major}。近期我準備申請 ${goal}，想請問老師是否方便協助撰寫推薦信。

為了減少老師整理資料的時間，我已先準備申請項目、截止日期、履歷與經歷摘要。這次推薦信截止資訊為：${deadline}。

我希望老師可以參考的經歷包含：${experience}。相關能力包含：${skills}。若老師願意協助，我會再將所有資料整理成一份文件寄給您。

謝謝老師撥冗閱讀，也理解老師行程繁忙。若這次時間不方便，也完全沒有問題。

敬祝 平安順心
你的姓名

二、要附上的資料
- 履歷 PDF
- 自傳或讀書計畫草稿
- 申請項目網址或簡章
- 截止日期與提交方式：${deadline}
- 希望老師提到的 3 個重點：${splitItems(skills).slice(0, 3).join("、")}
- 你的代表經歷：${experience}

三、給教授看的經歷摘要
${major}，申請 ${goal}。曾參與 ${experience}，並透過${skills}累積申請所需能力。可被提及的成果或證據為：${normalizeMetric(metric)}。`;
}

function generateChecklist({ major, goal, experience, skills, metric }) {
  const isDeadline = /\d{4}|\d{1,2}\/\d{1,2}|截止|前/.test(metric);
  const deadline = isDeadline ? metric : "尚未填寫，請先確認官方簡章";
  return `送件清單

申請人：${major}
申請項目：${goal}
截止資訊：${deadline}

必備文件：
- 申請表
- 履歷或個人資料表
- 自傳 / 讀書計畫 / 申請動機
- 成績單或在學證明
- 相關證明：${experience}
- 技能或語言證明：${skills}

送出前 30 分鐘檢查：
- 每個 PDF 都能正常開啟
- 檔名包含姓名、申請項目、文件類型
- 自傳與履歷中的日期、經歷名稱一致
- 推薦信提交方式已確認
- 雲端連結權限不是私人
- 信件主旨有寫清楚申請項目

風險提醒：
${isDeadline ? "- 你已填入截止資訊，請再確認時區與送件方式。" : "- 你還沒有填明確截止日，這是目前最大風險。"}
- 若需要推薦信，至少提前 2-3 週詢問教授。
- 不要在最後一天才掃描或合併 PDF。`;
}

function generateFilename({ major, goal }) {
  const cleanMajor = major.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "").slice(0, 12) || "學生";
  const cleanGoal = goal.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "").slice(0, 16) || "申請項目";
  const date = new Date().toISOString().slice(0, 10);
  return `檔案命名建議

統一格式：
姓名_${cleanGoal}_文件類型_${date}.pdf

範例：
- 王小明_${cleanGoal}_履歷_${date}.pdf
- 王小明_${cleanGoal}_自傳_${date}.pdf
- 王小明_${cleanGoal}_讀書計畫_${date}.pdf
- 王小明_${cleanGoal}_成績單_${date}.pdf
- 王小明_${cleanGoal}_證明文件_${date}.pdf

資料夾命名：
${date}_${cleanMajor}_${cleanGoal}_送件版

不要使用：
- final.pdf
- final2.pdf
- 新增 Microsoft Word 文件.pdf
- 真的最後版.pdf`;
}

function generate(type, data) {
  const tools = {
    resume: generateResume,
    checker: generateChecker,
    bio: generateBio,
    email: generateEmailPack,
    checklist: generateChecklist,
    filename: generateFilename
  };
  return tools[type](data);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    major: getValue("#major"),
    goal: getValue("#goal"),
    experience: getValue("#experience"),
    skills: getValue("#skills"),
    metric: getValue("#metric")
  };
  const type = document.querySelector("#toolType").value;
  resultBox.textContent = generate(type, data);
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
