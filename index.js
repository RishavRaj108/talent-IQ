// index.js (root of TALENT-IQ)

// Vercel docs: the file just needs to import express and export the app
import express from "express"; // import to satisfy Vercel's Express detection
import app from "./backend/src/server.js";

// Vercel will use this default export as the Express application
export default app;
