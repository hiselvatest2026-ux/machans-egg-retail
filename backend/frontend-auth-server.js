const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const BASIC_USER = process.env.BASIC_USER || "demo";
const BASIC_PASS = process.env.BASIC_PASS || "machans123";

function requireBasicAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.split(" ")[1] || "";
  const credentials = Buffer.from(token, "base64").toString("utf8");
  const [user, pass] = credentials.split(":");
  if (user === BASIC_USER && pass === BASIC_PASS) return next();
  res.set("WWW-Authenticate", 'Basic realm="Protected"');
  return res.status(401).send("Authentication required");
}

app.use(requireBasicAuth);

// Proxy API to local backend
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    logLevel: "warn",
  })
);

// Serve the built frontend
const buildDir = path.resolve(__dirname, "../frontend/build");
app.use(express.static(buildDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth-protected frontend server listening on ${PORT}`);
});