import { createApiHandler } from "@/lib/apiHandler";
import { apiResponse } from "@/lib/apiHelper";

async function handlePost(req, res) {
  try {
    const { userId, whatsappNumber, tempPassword, keluargaId } = req.body;

    if (!userId || !whatsappNumber) {
      return res
        .status(400)
        .json(
          apiResponse(false, null, "User ID dan nomor WhatsApp harus diisi")
        );
    }

    // Get user data from database
    const prisma = (await import("@/lib/prisma")).default;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(apiResponse(false, null, "User tidak ditemukan"));
    }

    let keluargaInfo = "";

    if (user.role === "JEMAAT" && keluargaId) {
      const keluarga = await prisma.keluarga.findUnique({
        where: { id: keluargaId },
        select: {
          noBagungan: true,
          rayon: {
            select: {
              namaRayon: true,
            },
          },
          jemaats: {
            where: {
              statusDalamKeluarga: {
                status: "Kepala Keluarga",
              },
            },
            select: {
              nama: true,
            },
            take: 1,
          },
        },
      });

      if (keluarga) {
        const kepalaKeluarga = keluarga.jemaats?.[0]?.nama || "Belum diketahui";

        keluargaInfo = `

👨‍👩‍👧‍👦 *Informasi Keluarga:*
- Kepala Keluarga: ${kepalaKeluarga || `Bangunan ${keluarga.noBagungan}`}
- Rayon: ${keluarga.rayon?.namaRayon || "-"}

📝 *Catatan untuk Role Jemaat:*
- Setelah login pertama, Anda akan diminta melengkapi profil pribadi
- Pastikan pilih keluarga yang sesuai dengan kepala keluarga: ${kepalaKeluarga || `Bangunan ${keluarga.noBagungan}`}`;
      }
    }

    // Create WhatsApp message
    const message = `🔐 *Data Akun GMIT Imanuel Oepura*

Halo! Berikut adalah data akun Anda:

👤 *Username:* ${user.username}
📧 *Email:* ${user.email}
🔑 *Password:* ${tempPassword || "oepura78"}
👥 *Role:* ${user.role}${keluargaInfo}

🌐 *Link Login:* ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login

⚠️ *Penting:*
- Harap segera login dan ubah password Anda
- Jangan bagikan data akun ini kepada orang lain
- Simpan data ini dengan aman

Terima kasih!
GMIT Imanuel Oepura`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return res.status(200).json(
      apiResponse(
        true,
        {
          whatsappUrl,
          message,
          user: {
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
        "Data akun berhasil disiapkan untuk dikirim via WhatsApp"
      )
    );
  } catch (error) {
    console.error("Error sending account data:", error);

    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal mengirim data akun", error.message)
      );
  }
}

export default createApiHandler({
  POST: handlePost,
});
