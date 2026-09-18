import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

// Validate required Supabase Storage env vars
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "evidence-images";

// Max 5 MB, in-memory so we can stream to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
    cb(null, true);
  },
});

// POST /api/upload — authenticated file upload to Supabase Storage
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(501).json({
        error: "File storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const requestId = z.string().min(1).safeParse(req.body.requestId);
    if (!requestId.success) {
      return res.status(400).json({ error: "requestId is required" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Safe storage path: <userId>/<requestId>/<timestamp>-<originalname>
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${req.user!.id}/${requestId.data}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return res.status(500).json({ error: "File upload failed" });
    }

    // Return path so the caller can store it in water_requests.evidence_image_path
    return res.status(201).json({
      path: storagePath,
      mime: req.file.mimetype,
      size: req.file.size,
      originalName: req.file.originalname,
    });
  }
);

export default router;
