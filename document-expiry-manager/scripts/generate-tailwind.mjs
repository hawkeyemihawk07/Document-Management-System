import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "@tailwindcss/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceCssPath = path.join(projectRoot, "src", "index.css");
const outputCssPath = path.join(projectRoot, "src", "index.generated.css");

const SOURCE_FILE_EXTENSIONS = new Set([".html", ".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  ".git",
  ".vite",
]);

const collectSourceFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...(await collectSourceFiles(fullPath)));
      }
      continue;
    }

    if (SOURCE_FILE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const extractCandidates = (content) => {
  const candidates = new Set();
  const literalMatches = content.match(/(["'`])((?:\\.|(?!\1)[\s\S])*)\1/g) || [];

  for (const literal of literalMatches) {
    const rawValue = literal.slice(1, -1);

    for (const token of rawValue.split(/\s+/)) {
      const candidate = token.trim();

      if (
        candidate &&
        !candidate.startsWith("http") &&
        !candidate.includes("${") &&
        /[a-z]/i.test(candidate) &&
        !/[<>]/.test(candidate)
      ) {
        candidates.add(candidate);
      }
    }
  }

  return candidates;
};

const writeGeneratedCss = async (output) => {
  try {
    await fs.writeFile(outputCssPath, output, "utf8");
    return "updated";
  } catch (error) {
    if (!["EPERM", "EACCES"].includes(error.code)) {
      throw error;
    }

    try {
      await fs.access(outputCssPath);
      console.warn(
        `Warning: could not update ${path.relative(projectRoot, outputCssPath)} because it is locked. Reusing the existing generated CSS file.`,
      );
      return "reused";
    } catch {
      throw error;
    }
  }
};

const main = async () => {
  const css = await fs.readFile(sourceCssPath, "utf8");
  const sourceFiles = await collectSourceFiles(path.join(projectRoot, "src"));
  const indexHtmlPath = path.join(projectRoot, "index.html");
  const candidates = new Set();

  for (const filePath of [...sourceFiles, indexHtmlPath]) {
    const content = await fs.readFile(filePath, "utf8");
    for (const candidate of extractCandidates(content)) {
      candidates.add(candidate);
    }
  }

  const compiled = await compile(css, {
    base: projectRoot,
    from: sourceCssPath,
    onDependency: () => {},
  });

  const output = compiled.build([...candidates]);
  const outputStatus = await writeGeneratedCss(output);

  console.log(
    `${outputStatus === "updated" ? "Generated" : "Reused"} ${path.relative(projectRoot, outputCssPath)} with ${candidates.size} candidates.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
