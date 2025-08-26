const express = require("express");
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
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    logLevel: "warn",
  })
);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Auth-protected backend proxy listening on ${PORT}`);
});