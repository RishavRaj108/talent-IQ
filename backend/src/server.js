import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"

const app = express();

// ✅ Proper __dirname in ESM (since "type": "module" in backend/package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// ----------------- ROUTES -----------------
app.get("/health", (req, res) => {
  res.status(200).json({
    msg: "api is up and running",
  });
});


// ----------------- SERVE FRONTEND IN PROD -----------------
// This runs when NODE_ENV = "production" (on Vercel)
if (ENV.NODE_ENV === "production") {
  // server.js is in backend/src -> go two levels up to project root, then frontend/dist
  const distPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(distPath));

  // SPA fallback: any non-API route returns index.html
  // ❗ use "/*" not "/{*any}"
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ----------------- DATABASE CONNECTION -----------------
let dbConnected = false;

async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    console.log("✅ MongoDB connected");
  }
}

// ----------------- LOCAL VS VERCEL -----------------
// Locally: run `npm run start` from backend → start normal server
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await ensureDB();
      app.listen(ENV.PORT, () =>
        console.log("Server is running on port:", ENV.PORT)
      );
    } catch (error) {
      console.error("💥 Error starting the server", error);
    }
  };

  startServer();
} else {
  // On Vercel: no app.listen, just make sure DB is ready on cold start
  ensureDB().catch((err) =>
    console.error("💥 Error connecting to DB on Vercel", err)
  );
}

// ----------------- EXPORT FOR VERCEL -----------------
// Vercel will import this Express app (via root index.js)
export default app;



//development