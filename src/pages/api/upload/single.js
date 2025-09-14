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

// ===== 5. API ROUTE - /api/upload/single.js =====
//  import {
//   uploadToS3,
//   generateFileName,
//   getFilePath,
// } from "@/lib/upload-helpers";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const uploadType = formData.get("type") || "uploads"; // galeri, pengumuman, etc

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validasi file type dan size
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "File type not allowed. Only JPEG, PNG, WebP, and PDF files are accepted.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB.",
        },
        { status: 400 }
      );
    }

    // Generate filename dan path
    const fileName = generateFileName(file.name);
    const filePath = getFilePath(uploadType, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload ke S3
    const publicUrl = await uploadToS3(
      {
        buffer,
        mimetype: file.type,
        originalname: file.name,
      },
      filePath
    );

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
