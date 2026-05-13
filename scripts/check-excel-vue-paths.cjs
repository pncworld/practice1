/**
 * 엑셀(또는 CSV)에서 Vue 경로 열을 읽어 PncOffice 워크스페이스에 파일이 있는지 검사합니다.
 *
 * 사용법:
 *   node scripts/check-excel-vue-paths.cjs <파일경로.xlsx|csv> [열번호_1부터] [--skip=N]
 *
 * 예:
 *   node scripts/check-excel-vue-paths.cjs ./scripts/menu-list.xlsx 5
 *   node scripts/check-excel-vue-paths.cjs "D:/work/menu.xlsx" 5 --skip=1
 *
 * 출력: scripts/vue-path-check-report.json, scripts/vue-path-check-report.csv
 */

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { file: null, col1: 5, skip: 0 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--skip=")) {
      args.skip = parseInt(a.slice("--skip=".length), 10) || 0;
    } else if (!args.file && !a.startsWith("--")) {
      if (!args._hadFile) {
        args.file = a;
        args._hadFile = true;
      } else {
        const n = parseInt(a, 10);
        if (!Number.isNaN(n)) args.col1 = n;
      }
    } else if (/^\d+$/.test(a)) {
      args.col1 = parseInt(a, 10);
    }
  }
  return args;
}

function normalizePathCell(raw) {
  if (raw == null || raw === "") return "";
  return String(raw).replace(/\\/g, "/").trim();
}

/** 셀 값에서 .vue 경로 후보 문자열 추출 */
function extractVuePathsFromCell(text) {
  const s = normalizePathCell(text);
  if (!s) return [];
  const out = new Set();
  const re = /[^\s"'<>]+\.vue\b/gi;
  let m;
  while ((m = re.exec(s)) !== null) {
    out.add(m[0].replace(/^["']|["']$/g, ""));
  }
  return [...out];
}

function candidateFsPaths(relVue) {
  const s = normalizePathCell(relVue).replace(/^\//, "");
  if (!s.endsWith(".vue")) return [];

  const list = [];
  const push = (p) => list.push(path.normalize(p));

  push(path.join(ROOT, s));
  push(path.join(ROOT, "src", s));
  if (s.startsWith("src/")) {
    push(path.join(ROOT, s));
  }
  if (s.startsWith("views/")) {
    push(path.join(ROOT, "src", s));
  }
  if (!s.includes("/")) {
    push(path.join(ROOT, "src", "views", s));
  }
  const parts = s.split("/");
  if (parts.length >= 2 && !["src", "views"].includes(parts[0])) {
    push(path.join(ROOT, "src", "views", s));
  }

  return [...new Set(list)];
}

function fileExistsAny(candidates) {
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function readRows(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".csv") {
    const buf = fs.readFileSync(filePath);
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  }
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
}

function main() {
  const argv = process.argv.slice(2);
  const fileArg = argv.find((a) => !a.startsWith("--") && /\.(xlsx|xls|csv)$/i.test(a));
  const colArg = argv.find((a) => /^\d+$/.test(a));
  const skipMatch = argv.find((a) => a.startsWith("--skip="));
  const skip = skipMatch ? parseInt(skipMatch.replace("--skip=", ""), 10) || 0 : 0;
  const col1 = colArg ? parseInt(colArg, 10) : 5;
  const col0 = Math.max(0, col1 - 1);

  if (!fileArg) {
    console.error(
      "사용법: node scripts/check-excel-vue-paths.cjs <파일.xlsx|xls|csv> [열_1기준_기본5] [--skip=헤더제외행수]\n" +
        "예: node scripts/check-excel-vue-paths.cjs ./scripts/menu-list.xlsx 5 --skip=1"
    );
    process.exit(1);
  }

  const abs = path.isAbsolute(fileArg) ? fileArg : path.join(ROOT, fileArg);
  if (!fs.existsSync(abs)) {
    console.error("파일을 찾을 수 없습니다:", abs);
    process.exit(1);
  }

  const rows = readRows(abs);
  const results = [];

  for (let r = skip; r < rows.length; r++) {
    const row = rows[r] || [];
    const primary = row[col0];
    let paths = extractVuePathsFromCell(primary);
    if (paths.length === 0) {
      for (let c = 0; c < row.length; c++) {
        paths.push(...extractVuePathsFromCell(row[c]));
      }
      paths = [...new Set(paths)];
    }

    for (const rel of paths) {
      const cands = candidateFsPaths(rel);
      const hit = fileExistsAny(cands);
      results.push({
        sheetRow: r + 1,
        excelColumn1Based: col1,
        rawCell: normalizePathCell(primary),
        vuePathRaw: rel,
        exists: Boolean(hit),
        resolvedPath: hit || cands[0] || null,
        triedPaths: cands,
      });
    }
  }

  const key = (x) => x.vuePathRaw + "|" + x.sheetRow;
  const dedup = [];
  const seen = new Set();
  for (const x of results) {
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(x);
  }

  const outDir = path.join(ROOT, "scripts");
  const jsonPath = path.join(outDir, "vue-path-check-report.json");
  const csvPath = path.join(outDir, "vue-path-check-report.csv");

  fs.writeFileSync(jsonPath, JSON.stringify(dedup, null, 2), "utf8");

  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csvLines = [
    ["sheetRow", "excelColumn1Based", "vuePathRaw", "exists", "resolvedPath", "rawCell"].map(esc).join(","),
    ...dedup.map((x) =>
      [x.sheetRow, x.excelColumn1Based, x.vuePathRaw, x.exists, x.resolvedPath || "", x.rawCell].map(esc).join(",")
    ),
  ];
  fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");

  const ok = dedup.filter((x) => x.exists).length;
  console.log(`검사 행(고유 .vue 경로 기준): ${dedup.length}, 존재: ${ok}, 없음: ${dedup.length - ok}`);
  console.log("JSON:", jsonPath);
  console.log("CSV:", csvPath);
}

main();
