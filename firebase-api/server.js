import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";
import { readFile } from "fs/promises";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Firebase Admin
let db;
let isInitialized = false;

async function initializeFirebase() {
  if (isInitialized) return db;

  try {
    console.log("🔄 Initializing Firebase...");

    let serviceAccount;

    // Try to load service account from Base64 environment variable (Most Robust for Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      try {
        const decodedJson = Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
          "base64"
        ).toString("utf8");
        serviceAccount = JSON.parse(decodedJson);
        console.log(
          "✅ Loaded Firebase service account from Base64 environment variable"
        );
      } catch (error) {
        console.error(
          "❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:",
          error.message
        );
      }
    }

    // Fallback: Try to load service account from file (Local Dev)
    if (!serviceAccount) {
      try {
        const serviceAccountFile = await readFile(
          "./serviceAccountKey.json",
          "utf8"
        );
        serviceAccount = JSON.parse(serviceAccountFile);
        console.log("✅ Loaded Firebase service account from file");
      } catch (error) {
        console.log(
          "⚠️  No serviceAccountKey.json found, checking individual environment variables..."
        );

        // Final Fallback: Individual environment variables
        if (process.env.FIREBASE_PROJECT_ID) {
          console.log(
            `📌 Project ID found: ${process.env.FIREBASE_PROJECT_ID}`
          );
          console.log(
            `📌 Client Email found: ${
              process.env.FIREBASE_CLIENT_EMAIL ? "Yes" : "No"
            }`
          );

          let rawKey = process.env.FIREBASE_PRIVATE_KEY || "";

          // Debug logging (secure)
          console.log(`📌 Private Key length: ${rawKey.length}`);
          console.log(
            `📌 Private Key starts with: "${rawKey.substring(0, 25)}..."`
          );
          console.log(`📌 Private Key contains \\n: ${rawKey.includes("\\n")}`);
          console.log(
            `📌 Private Key contains actual newline: ${rawKey.includes("\n")}`
          );

          // Robust PEM parsing logic as a backup
          let privateKey = rawKey.trim();
          if (privateKey.includes("\\n"))
            privateKey = privateKey.replace(/\\n/g, "\n");
          privateKey = privateKey
            .replace(/\r/g, "")
            .replace(/^"|"$/g, "")
            .trim();

          if (privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
            const start = privateKey.indexOf("-----BEGIN PRIVATE KEY-----");
            const end =
              privateKey.indexOf("-----END PRIVATE KEY-----") +
              "-----END PRIVATE KEY-----".length;
            privateKey = privateKey.substring(start, end);
          } else {
            // If headers/footers are missing, try to reconstruct
            let body = privateKey.replace(/\s/g, ""); // Strip all whitespace
            privateKey = `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`;
            console.log(
              "✅ Reconstructed PEM structure for individual env var"
            );
          }

          serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          };
          console.log("✅ Using individual Firebase environment variables");
        } else {
          throw new Error(
            "No Firebase credentials found. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 or individual variables."
          );
        }
      }
    }

    if (!serviceAccount) {
      throw new Error(
        "Firebase service account credentials could not be loaded from any source."
      );
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin app initialized");
    }

    db = admin.firestore();
    isInitialized = true;
    console.log("✅ Firestore database connected");
    return db;
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
    throw error;
  }
}

// Middleware to ensure Firebase is initialized
app.use(async (req, res, next) => {
  try {
    await initializeFirebase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Firebase Initialization Failed",
      message: error.message,
    });
  }
});

// Health check endpoint (Triggering fresh Vercel deployment)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Firebase Balance API is running",
    timestamp: new Date().toISOString(),
    initialized: isInitialized,
    version: "v1.0.3-final-fix",
  });
});

// Get user balance
app.get("/api/user/:userId/balance", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      // User doesn't exist - create with default balance
      const defaultBalance = 500;
      await db.collection("users").doc(userId).set({
        balance: defaultBalance,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(
        `📝 Created new user ${userId} with balance ${defaultBalance} SAR`
      );

      return res.json({
        success: true,
        userId,
        balance: defaultBalance,
        currency: "SAR",
        isNew: true,
      });
    }

    const userData = userDoc.data();
    // Use a more robust check (||) to handle null, 0, or undefined consistently
    const balance = userData.balance || 500;

    console.log(`💰 User ${userId} balance retrieved:`, {
      fromDb: userData.balance,
      final: balance,
    });

    res.json({
      success: true,
      userId,
      balance: Number(balance), // Ensure it's a number
      currency: "SAR",
      isNew: false,
      serverVersion: "v1.0.3-final-fix",
    });
  } catch (error) {
    console.error("❌ Error getting balance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user balance",
      details: error.message,
    });
  }
});

// Deduct balance from user
app.post("/api/user/:userId/deduct-balance", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    console.log(`[DEDUCT] Request Received - User: ${userId}, Body:`, req.body);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    // Parse and validate amount robustly
    const numericAmount = parseFloat(amount);

    if (
      amount === undefined ||
      amount === null ||
      isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      console.error(`[DEDUCT ERROR] Invalid amount for user ${userId}:`, {
        received: amount,
        type: typeof amount,
        parsed: numericAmount,
      });
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Must be a positive number.",
        details: {
          received: amount,
          type: typeof amount,
        },
      });
    }

    // Ensure we use the parsed number for all calculations
    const amountToDeduct = numericAmount;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const userData = userDoc.data();
    // Use the same robust logic as the /balance endpoint (default to 500)
    const currentBalance = userData.balance || 500;

    // Check if user has sufficient balance
    if (currentBalance < amountToDeduct) {
      console.log(
        `⚠️  Insufficient balance for user ${userId}: ${currentBalance} < ${amountToDeduct}`
      );
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
        balance: currentBalance,
        required: amountToDeduct,
        shortage: amountToDeduct - currentBalance,
      });
    }

    const newBalance = currentBalance - amountToDeduct;

    // Update balance in Firestore
    await userRef.update({
      balance: newBalance,
      updatedAt: new Date(),
    });

    console.log(
      `✅ Deducted ${amountToDeduct} SAR from user ${userId}: ${currentBalance} → ${newBalance}`
    );

    res.json({
      success: true,
      userId,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      amountDeducted: amountToDeduct,
      currency: "SAR",
      serverVersion: "v1.0.3-final-fix",
    });
  } catch (error) {
    console.error("❌ Error deducting balance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to deduct balance",
      details: error.message,
    });
  }
});

// Add balance to user (for testing/admin purposes)
app.post("/api/user/:userId/add-balance", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    if (amount === undefined || amount === null || amount < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Must be a positive number.",
      });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    let currentBalance = 0;
    if (userDoc.exists) {
      currentBalance = userDoc.data().balance ?? 0;
    }

    const newBalance = currentBalance + amount;

    await userRef.set(
      {
        balance: newBalance,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log(
      `✅ Added ${amount} SAR to user ${userId}: ${currentBalance} → ${newBalance}`
    );

    res.json({
      success: true,
      userId,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      amountAdded: amount,
      currency: "SAR",
    });
  } catch (error) {
    console.error("❌ Error adding balance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add balance",
      details: error.message,
    });
  }
});

// ==========================================
// Image Analysis Endpoint
// ==========================================
app.post("/api/analyze-images", async (req, res) => {
  try {
    console.log("🖼️ Image analysis request received");

    // 1. Verify Firebase Auth Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const userId = decodedToken.uid;
    console.log(`✅ Authenticated user: ${userId}`);

    // 2. Validate request body
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "Maximum 5 images allowed" });
    }

    console.log(`📸 Analyzing ${images.length} images`);

    // 3. Call AIML API
    const aimlApiKey =
      process.env.AIML_API_KEY || "24846e8f3bce499aaf46ae76bb75f388";

    const response = await fetch(
      "https://api.aimlapi.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aimlApiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
          messages: [
            {
              role: "system",
              content:
                "أنت مساعد ذكي متخصص في تحليل الصور واقتراح موضوعات بحثية أكاديمية باللغة العربية.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "بناءً على هذه الصور، اقترح عنوان بحث أكاديمي مناسب باللغة العربية. أعطني العنوان فقط بدون أي نص إضافي.",
                },
                ...images.map((base64) => ({
                  type: "image_url",
                  image_url: { url: base64 },
                })),
              ],
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ AIML API error:", errorData);
      return res.status(500).json({
        error: "AI analysis failed",
        details: errorData.error?.message,
      });
    }

    const aiResponse = await response.json();
    const suggestedTopic = aiResponse.choices?.[0]?.message?.content?.trim();
    const tokensUsed = aiResponse.usage?.total_tokens || 0;

    console.log(`✅ Topic suggested: "${suggestedTopic}"`);
    console.log(`💰 Tokens used: ${tokensUsed}`);

    // 4. Log to Firebase
    const firebaseDb = await initializeFirebase();
    const logEntry = {
      userId,
      action: "image_analysis",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      imagesCount: images.length,
      suggestedTopic,
      tokensUsed,
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      status: "success",
    };

    await firebaseDb.collection("usage_logs").add(logEntry);
    console.log("📝 Usage logged to Firebase");

    // 5. Return response
    return res.json({
      success: true,
      suggestedTopic,
      tokensUsed,
    });
  } catch (error) {
    console.error("❌ Error in image analysis:", error);

    // Log error to Firebase
    try {
      const firebaseDb = await initializeFirebase();
      await firebaseDb.collection("usage_logs").add({
        userId: req.body?.userId || "unknown",
        action: "image_analysis",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: "error",
        error: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// For Vercel, we export the app
// For local dev, we run app.listen if NOT in a Vercel environment
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("");
    console.log("🚀 Firebase Balance API Server");
    console.log("================================");
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log("");
    console.log("Available endpoints:");
    console.log(`  GET  /api/user/:userId/balance`);
    console.log(`  POST /api/user/:userId/deduct-balance`);
    console.log(`  POST /api/user/:userId/add-balance`);
    console.log(`  POST /api/analyze-images`);
    console.log("");
    // Firebase initialization will happen on the first request via middleware
  });
}

export default app;
