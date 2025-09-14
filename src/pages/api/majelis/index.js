import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { parseQueryParams } from "@/lib/queryParams";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { pagination, sort, where } = parseQueryParams(req.query, {
      searchField: "namaLengkap",
      defaultSortBy: "namaLengkap",
    });

    const total = await prisma.majelis.count({ where });

    const items = await prisma.majelis.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
      include: {
        jenisJabatan: {
          select: {
            namaJabatan: true,
          },
        },
        rayon: {
          select: {
            namaRayon: true,
          },
        },
        jemaat: {
          select: {
            nama: true,
          },
        },
        User: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / pagination.limit);

    const result = {
      items,
      pagination: {
        ...pagination,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };

    return res
      .status(200)
      .json(apiResponse(true, result, "Data berhasil diambil"));
  } catch (error) {
    console.error("Error fetching majelis:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil data majelis",
          error.message
        )
      );
  }
}

export default createApiHandler({
  GET: handleGet,
});