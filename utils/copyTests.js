import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyTests = async (destination) => {
  const parentDir = path.dirname(__dirname);
  return fs.copy(path.join(parentDir, "tests"), destination);
};

export default copyTests;
