const path = require("node:path");
const fs = require("node:fs");

const filenames = fs.readdirSync("./input");
fs.mkdirSync("./output", { recursive: true });

for (const filename of filenames) {
  let result = "";
  const file = path.parse(filename);
  const ext = file.ext;
  let name = file.name;

  // result += name.split(' ').join('-').toLowerCase();
  name = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  name = name.replace(/-+/g, "-");
  name = name.replace(/^-|-$/, "");

  result += name;
  result += ext.toLowerCase();
  const source = path.join("./input", filename);
  const destination = path.join("./output", result);

  fs.copyFileSync(source, destination);
}
