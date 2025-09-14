import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

async function handlePost(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Token tidak ditemukan"));
    }

    // Verify token
    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Token tidak valid atau telah kedaluwarsa"));
    }

    // Check if it's an invitation token
    if (tokenPayload.type !== "invitation") {
      return res
        .status(400)
        .json(apiResponse(false, null, "Token bukan token undangan"));
    }

    // JWT tokens with 7d expiration are automatically checked by verifyToken
    // No need for manual expiration check since JWT handles this

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        idJemaat: true
      }
    });

    if (!user) {
      return res
        .status(404)
        .json(apiResponse(false, null, "User tidak ditemukan"));
    }

    // Check if user already has profile
    if (user.idJemaat) {
      return res
        .status(400)
        .json(apiResponse(false, null, "User sudah memiliki profil lengkap"));
    }

    // Verify keluarga still exists
    const keluarga = await prisma.keluarga.findUnique({
      where: { id: tokenPayload.keluargaId },
      select: {
        id: true,
        noBagungan: true,
        rayon: {
          select: {
            id: true,
            namaRayon: true
          }
        }
      }
    });

    if (!keluarga) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Keluarga tidak ditemukan"));
    }

    return res
      .status(200)
      .json(apiResponse(true, {
        valid: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        keluarga: {
          id: keluarga.id,
          noBagungan: keluarga.noBagungan,
          rayon: keluarga.rayon
        },
        expiresAt: new Date(tokenPayload.exp * 1000).toISOString() // Convert JWT exp to ISO string
      }, "Token undangan valid"));

  } catch (error) {
    console.error("Error validating invitation token:", error);
    return res
      .status(500)
      .json(apiResponse(false, null, "Terjadi kesalahan server", error.message));
  }
}

export default createApiHandler({
  POST: handlePost,
});