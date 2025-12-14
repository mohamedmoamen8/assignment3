const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { json } = require("node:stream/consumers");

const port = 3000;
const usersFile = path.resolve("./users.json");

function readUsers() {
  const data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    callback(JSON.parse(body));
  });
}

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(method, url);

  if (url === "/user" && method === "POST") {
    getBody(req, (newUser) => {
      const users = readUsers();

      const emailExists = users.some((u) => u.email === newUser.email);

      if (emailExists) {
        res.writeHead(400);
        return res.end("Email already exists");
      }

      newUser.id = Date.now().toString();
      users.push(newUser);
      writeUsers(users);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
  } else if (url === "/user" && method === "GET") {
    const readStream = fs.createReadStream(usersFile);

    res.writeHead(200, { "Content-Type": "application/json" });
    readStream.pipe(res);
  } else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = url.split("/")[2];

    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.writeHead(404);
      return res.end("User not found");
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const updates = JSON.parse(body);

      users[userIndex] = {
        ...users[userIndex],
        ...updates,
      };

      writeUsers(users);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users[userIndex]));
    });
  } else if (method === "DELETE" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    const users = readUsers();
    const filteredUsers = users.filter((user) => user.id !== id);
    if (users.length === filteredUsers.length) {
      res.writeHead(404);
      return res.end("User not found");
    }

    writeUsers(filteredUsers);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted" }));
  } else if (method === "GET" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    const users = readUsers();
    const user = users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404);
      return res.end("User Not found");
    }
    res.writeHead(200, { "content-type": "application/json" });
     res.end(JSON.stringify(user));
  } else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(port, () => {
  console.log(`server running on port ${port} 👌`);
});
