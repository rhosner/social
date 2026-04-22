import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // allow all origins — lock this down in production
app.use(express.json());

// Proxy all GraphQL requests to Buffer
app.post("/buffer", async (req, res) => {
  const apiKey = req.headers["x-buffer-key"];
  if (!apiKey) return res.status(401).json({ error: "Missing x-buffer-key header" });

  try {
    const response = await fetch("https://api.buffer.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Buffer proxy running on port ${PORT}`));
