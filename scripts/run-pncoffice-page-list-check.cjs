/** 라우트/메뉴 모듈코드(strUrl 앞부분) → src/views 하위 폴더명 (다르면만 기입) */
const STRURL_MOD_TO_VIEWS_FOLDER = {
  MISALES: "MISALE",
};

function viewsFolderFromStrUrlModule(mod) {
  const m = String(mod || "").trim();
  return STRURL_MOD_TO_VIEWS_FOLDER[m] || m;
}
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const ROOT = path.resolve(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "scripts", "pncOffice 페이지 목록_260513.xlsx");
const SHEET = "Sheet3";

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error("파일 없음:", XLSX_PATH);
    process.exit(1);
  }

  const wb = XLSX.readFile(XLSX_PATH);
  const sh = wb.Sheets[SHEET];
  if (!sh) {
    console.error("시트 없음:", SHEET, "→", wb.SheetNames.join(", "));
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(sh, { header: 1, defval: "" });
  const header = (rows[0] || []).map((c) => String(c).trim());
  const ix = {};
  header.forEach((c, i) => {
    if (c) ix[c] = i;
  });

  const iUrl = ix.strUrl;
  if (iUrl === undefined) {
    console.error("헤더에 strUrl 없음");
    process.exit(1);
  }

  const extraKeys = ["viewsFolder", "vuePath", "exists"];

  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rec = { sheetRow: r + 1 };
    for (let c = 0; c < header.length; c++) {
      const key = header[c] || `col_${c}`;
      rec[key] = row[c];
    }

    const u = String(row[iUrl] || "").trim();
    if (u && u.includes("::")) {
      const parts = u.split("::");
      const mod = (parts[0] || "").trim();
      const file = (parts[1] || "").trim();
      const base = file.replace(/\.xml$/i, "");
      if (mod && base) {
        const viewDir = viewsFolderFromStrUrlModule(mod);
        const vueRel = path.join("src", "views", viewDir, `${base}.vue`);
        const abs = path.join(ROOT, vueRel);
        rec.viewsFolder = viewDir;
        rec.vuePath = vueRel.split(path.sep).join("/");
        rec.exists = fs.existsSync(abs);
      } else {
        rec.viewsFolder = "";
        rec.vuePath = "";
        rec.exists = null;
      }
    } else {
      rec.viewsFolder = "";
      rec.vuePath = "";
      rec.exists = null;
    }

    out.push(rec);
  }

  const withPath = out.filter((x) => x.vuePath);
  const ok = withPath.filter((x) => x.exists === true).length;
  const jsonPath = path.join(ROOT, "scripts", "vue-path-check-report.json");
  const csvPath = path.join(ROOT, "scripts", "vue-path-check-report.csv");

  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf8");

  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const csvCols = [...header.filter(Boolean), ...extraKeys];
  const csvLines = [
    ["sheetRow", ...csvCols].map(esc).join(","),
    ...out.map((x) =>
      ["sheetRow", ...csvCols]
        .map((k) => {
          let v = x[k];
          if (k === "exists" && v == null) v = "n/a";
          return esc(v);
        })
        .join(",")
    ),
  ];
  try {
    fs.writeFileSync(csvPath, "\uFEFF" + csvLines.join("\r\n"), "utf8");
    console.log("→", csvPath);
  } catch (e) {
    if (e && e.code === "EBUSY") {
      console.error("CSV 저장 실패(파일이 다른 프로그램에서 열려 있음). 엑셀 등에서 닫은 뒤 다시 실행하세요:", csvPath);
    } else {
      throw e;
    }
  }
  console.log(
    JSON.stringify(
      {
        sheet: SHEET,
        rows: out.length,
        rowsWithVuePath: withPath.length,
        exists: ok,
        missing: withPath.length - ok,
        rowsNoPath: out.length - withPath.length,
      },
      null,
      2
    )
  );
  console.log("→", jsonPath);
}

main();
