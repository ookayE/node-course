import http from "http";
import fs from "fs/promises";
import dotenv from "dotenv";
import url from "url";
import path from "path";
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 8000;

//provides the absolute path of the currently executing file
const __filename = url.fileURLToPath(import.meta.url);

//provides the absolute path of the directory that contains the currently executing file
const __dirname = path.dirname(__filename);

console.log(__filename, __dirname);

const server = http.createServer(async (request, response) => {
  try {
    //check if GET request:
    let filePath;
    if (request.method === "GET") {
      if (request.url === "/") {
        filePath = path.join(__dirname, "public", "index.html");
      } else if (request.url === "/about") {
        filePath = path.join(__dirname, "public", "about.html");
      } else {
        throw new Error("Not Found");
      }
    } else {
      throw new Error("Method Not Allowed");
    }

    const data = await fs.readFile(filePath);
    response.setHeader("Content-Type", "text/html");
    response.write(data);
    response.end();
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/html" });
    response.end(`Server Error`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
