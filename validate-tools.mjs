import { readFileSync } from "node:fs";
import vm from "node:vm";

const elements = new Map();
const ids = ["toolForm", "resultBox", "copyResult", "templateOutput", "toolType", "major", "goal", "experience", "skills", "metric"];

for (const id of ids) {
  elements.set(`#${id}`, {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    addEventListener(type, handler) {
      this[`on${type}`] = handler;
    }
  });
}

elements.get("#major").value = "資管系大三";
elements.get("#goal").value = "資料分析實習";
elements.get("#experience").value = "問卷分析專題、咖啡廳打工、系學會活動";
elements.get("#skills").value = "Excel、Python、簡報";
elements.get("#metric").value = "分析 120 份問卷";

const context = {
  document: {
    querySelector(selector) {
      return elements.get(selector);
    },
    querySelectorAll() {
      return [];
    }
  },
  navigator: {
    clipboard: {
      writeText: async () => {}
    }
  },
  window: {
    setTimeout() {}
  }
};

vm.createContext(context);
vm.runInContext(readFileSync("app.js", "utf8"), context);

const types = ["resume", "checker", "bio", "email", "checklist", "filename"];
for (const type of types) {
  elements.get("#toolType").value = type;
  elements.get("#toolForm").onsubmit({ preventDefault() {} });
  const output = elements.get("#resultBox").textContent;
  if (!output || output.length < 120) throw new Error(`${type} output too short`);
  if (type === "checker" && !output.includes("分數")) throw new Error("checker missing score");
  if (type === "filename" && !output.includes(".pdf")) throw new Error("filename missing PDF examples");
}

console.log(`TOOL_MODES_OK=${types.length}`);
