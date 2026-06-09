import { readFileSync } from "node:fs";
import vm from "node:vm";

const elements = new Map();
const ids = ["toolForm", "resultBox", "copyResult", "downloadResult", "templateOutput", "toolType", "major", "goal", "experience", "skills", "metric", "targetText", "tone"];

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
elements.get("#targetText").value = "需要熟悉 Excel、Python、資料分析，能完成簡報與團隊合作。";
elements.get("#tone").value = "confident";

const context = {
  document: {
    querySelector(selector) {
      return elements.get(selector);
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return {
        href: "",
        download: "",
        click() {},
        remove() {}
      };
    },
    body: {
      appendChild() {}
    }
  },
  navigator: {
    clipboard: {
      writeText: async () => {}
    }
  },
  window: {
    setTimeout() {},
    URL: {
      createObjectURL() {
        return "blob:mock";
      },
      revokeObjectURL() {}
    }
  },
  URL: {
    createObjectURL() {
      return "blob:mock";
    },
    revokeObjectURL() {}
  },
  Blob: class Blob {
    constructor(parts, options) {
      this.parts = parts;
      this.options = options;
    }
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
  if (["resume", "checker", "bio", "checklist"].includes(type) && !output.includes("關鍵字匹配")) throw new Error(`${type} missing keyword report`);
  if (type === "filename" && !output.includes(".pdf")) throw new Error("filename missing PDF examples");
}

elements.get("#downloadResult").onclick();

console.log(`TOOL_MODES_OK=${types.length}`);
