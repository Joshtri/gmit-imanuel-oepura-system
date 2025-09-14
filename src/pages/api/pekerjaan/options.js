import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { search } = req.query;

    const where = search
      ? {
          namaPekerjaan: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const options = await prisma.pekerjaan.findMany({
      where,
      select: {
        id: true,
        namaPekerjaan: true,
      },
      orderBy: {
        namaPekerjaan: "asc",
      },
      take: 20, // Limit untuk autocomplete
    });

    // Format untuk AutoCompleteInput
    const formattedOptions = options.map((item) => ({
      value: item.id,
      label: item.namaPekerjaan,
    }));

    return res
      .status(200)
      .json(apiResponse(true, formattedOptions, "Data berhasil diambil"));
  } catch (error) {
    console.error("Error fetching pekerjaan options:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil data pekerjaan",
          error.message
        )
      );
  }
}

export default createApiHandler({
  GET: handleGet,
});