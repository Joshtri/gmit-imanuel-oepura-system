import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { search } = req.query;

    const where = search
      ? {
          namaJabatan: {
            contains: search,
            mode: "insensitive",
          },
          isActive: true,
        }
      : { isActive: true };

    const options = await prisma.jenisJabatan.findMany({
      where,
      select: {
        id: true,
        namaJabatan: true,
      },
      orderBy: {
        namaJabatan: "asc",
      },
      take: 20, // Limit untuk autocomplete
    });

    // Format untuk AutoCompleteInput
    const formattedOptions = options.map((item) => ({
      value: item.id,
      label: item.namaJabatan,
    }));

    return res
      .status(200)
      .json(apiResponse(true, formattedOptions, "Data berhasil diambil"));
  } catch (error) {
    console.error("Error fetching jenis jabatan options:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil data jenis jabatan",
          error.message
        )
      );
  }
}

export default createApiHandler({
  GET: handleGet,
});