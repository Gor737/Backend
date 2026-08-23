const fs = require("node:fs");
const buffer = fs.readFileSync("file.txt");

const ceasarEncode = (key) => {
  const result = [];
  const alphabetCount = 26;
  const isUpper = (char) => char >= 65 && char <= 90;
  const isLower = (char) => char >= 97 && char <= 122;
  key %= 26;
  if (key < 0) key = alphabetCount + key;

  for (const char of buffer) {
    let hash = char;
    if (isLower(char)) {
      hash += key;
      if (hash > 122) hash -= alphabetCount;
    } else if (isUpper(char)) {
      hash += key;
      if (hash > 90) hash -= alphabetCount;
    }

    result.push(hash);
  }

  const data = Buffer.from(result);
  return data;
};

fs.writeFileSync("encodeResult.txt", ceasarEncode(44));