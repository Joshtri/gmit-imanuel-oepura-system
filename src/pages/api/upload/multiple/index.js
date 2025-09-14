import { s3Client } from "@/lib/s3-client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Generate unique filename
export function generateFileName(originalName) {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  const ext = originalName.split(".").pop();
  return `${timestamp}-${uuid}.${ext}`;
}

// Get file path based on type
export function getFilePath(type, fileName) {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  const basePaths = {
    galeri: `galeri/${year}/${month}`,
    pengumuman: `pengumuman/${year}/${month}`,
    documents: `documents/${year}/${month}`,
    avatars: `avatars/${year}/${month}`,
  };

  return `${basePaths[type] || "uploads"}/${fileName}`;
}

// Upload file to S3
export async function uploadToS3(file, filePath) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Buat file bisa diakses public
  });

  try {
    await s3Client.send(command);

    // Return public URL
    const publicUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filePath}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file");
  }
}

// Delete file from S3
export async function deleteFromS3(filePath) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete file");
  }
}

// ===== 6. API ROUTE - /api/upload/multiple.js =====
export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const uploadType = formData.get("type") || "uploads";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validasi per file
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB untuk multiple upload

        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name}: type not allowed`);
        }

        if (file.size > maxSize) {
          throw new Error(`File ${file.name}: too large`);
        }

        const fileName = generateFileName(file.name);
        const filePath = getFilePath(uploadType, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const publicUrl = await uploadToS3(
          {
            buffer,
            mimetype: file.type,
            originalname: file.name,
          },
          filePath
        );

        return {
          success: true,
          url: publicUrl,
          fileName: fileName,
          originalName: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          index: index,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          fileName: file.name,
          index: index,
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      success: failed.length === 0,
      data: {
        uploaded: successful,
        failed: failed,
        total: files.length,
        successCount: successful.length,
        failedCount: failed.length,
      },
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
