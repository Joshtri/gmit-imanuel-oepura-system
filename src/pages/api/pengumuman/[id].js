import prisma from "@/lib/prisma";

const apiResponse = (success, data = null, message = "", errors = null) => {
  return {
    success,
    data,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (!id) {
    return res.status(400).json(
      apiResponse(false, null, "Validasi gagal", {
        id: "ID pengumuman wajib diisi",
      })
    );
  }

  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res, id);
      default:
        res.setHeader("Allow", ["GET"]);
        return res
          .status(405)
          .json(apiResponse(false, null, `Method ${method} not allowed`));
    }
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Server error", error.message));
  }
}

async function handleGet(req, res, id) {
  try {
    const pengumuman = await prisma.pengumuman.findUnique({
      where: { id },
      include: {
        kategori: {
          select: { id: true, nama: true, deskripsi: true }
        },
        jenis: {
          select: { id: true, nama: true, deskripsi: true }
        },
      },
    });

    if (!pengumuman) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Pengumuman tidak ditemukan"));
    }

    return res
      .status(200)
      .json(apiResponse(true, pengumuman, "Data pengumuman berhasil diambil"));
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil data pengumuman",
          error.message
        )
      );
  }
}