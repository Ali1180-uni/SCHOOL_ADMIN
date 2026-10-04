import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const requiredEnvironment = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FIREBASE_SERVICE_ACCOUNT",
  "CORS_ORIGIN",
];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length > 0) {
  throw new Error(`Missing server environment variables: ${missingEnvironment.join(", ")}`);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch {
  throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON.");
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed."));
  },
}));
app.use(express.json());

function getBearerToken(request) {
  const [scheme, token] = (request.headers.authorization || "").split(" ");
  return scheme === "Bearer" ? token : null;
}

async function verifyUser(request) {
  const token = getBearerToken(request);
  if (!token) throw new Error("Missing bearer token.");
  return admin.auth().verifyIdToken(token);
}

app.post("/api/delete-image", async (request, response) => {
  try {
    await verifyUser(request);
  } catch {
    return response.status(401).json({ error: "Invalid or missing authentication token." });
  }

  const { publicId } = request.body || {};
  if (typeof publicId !== "string" || !publicId.startsWith("students/")) {
    return response.status(400).json({ error: "A valid student image public ID is required." });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    });
    return response.json(result);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return response.status(500).json({ error: "Unable to delete the Cloudinary image." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API server listening on port ${port}`));