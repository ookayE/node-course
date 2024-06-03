import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 8000;

const users = [
  { id: 1, name: "Dude Man" },
  { id: 2, name: "Chick Face" },
  { id: 3, name: "Some Guy" },
];

// Logger middleware
const logger = (request, response, next) => {
  console.log(`${request.method} ${request.url}`);
  next(); // next() passes control to the next middleware function in the stack.
};

// JSON middleware
const jsonMiddleware = (request, response, next) => {
  response.setHeader("Content-Type", "application/json");
  next();
};

// Route handler for GET /api/users
const getUsersHandler = (request, response) => {
  response.writeHead(200);
  response.write(JSON.stringify(users));
  response.end();
};

// Route handler for GET /api/users/:id
const getUserByIdHandler = (request, response) => {
  const id = request.url.split("/")[3];
  console.log(id);

  const user = users.find((user) => user.id === parseInt(id, 10));
  if (user) {
    response.writeHead(200);
    response.write(JSON.stringify(user));
  } else {
    response.writeHead(404);
    response.write(JSON.stringify({ message: "User not found" }));
  }
  response.end();
};

// Route handler for POST /api/users
const createUserHandler = (request, response) => {
  let body = "";
  // Listen for data
  request.on("data", (chunk) => {
    body += chunk.toString();
  });
  request.on("end", () => {
    try {
      const newUser = JSON.parse(body);
      users.push(newUser);
      response.writeHead(201);
      response.write(JSON.stringify(newUser));
    } catch (error) {
      response.writeHead(400);
      response.write(JSON.stringify({ message: "Invalid JSON format" }));
    }
    response.end();
  });
};

// Not found handler
const notFoundHandler = (request, response) => {
  response.writeHead(404);
  response.write(JSON.stringify({ message: "Route not found" }));
  response.end();
};

const server = createServer((request, response) => {
  logger(request, response, () => {
    jsonMiddleware(request, response, () => {
      if (request.url === "/api/users" && request.method === "GET") {
        getUsersHandler(request, response);
      } else if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "GET"
      ) {
        getUserByIdHandler(request, response);
      } else if (request.url === "/api/users" && request.method === "POST") {
        createUserHandler(request, response);
      } else {
        notFoundHandler(request, response);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
