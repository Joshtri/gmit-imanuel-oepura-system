import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { parseQueryParams } from "@/lib/queryParams";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { pagination, sort, where } = parseQueryParams(req.query, {
      searchField: "namaRayon",
      defaultSortBy: "namaRayon",
    });

    const total = await prisma.rayon.count({ where });

    const items = await prisma.rayon.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
      include: {
        keluargas: {
          select: {
            id: true,
            noBagungan: true,
            jemaats: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        _count: {
          select: {
            keluargas: true,
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
    console.error("Error fetching rayon:", error);

    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal mengambil data rayon", error.message)
      );
  }
}

async function handlePost(req, res) {
  try {
    const { namaRayon } = req.body;

    // Validate required fields
    if (!namaRayon) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Nama rayon wajib diisi"));
    }

    // Check if rayon name already exists
    const existingRayon = await prisma.rayon.findFirst({
      where: {
        namaRayon: {
          equals: namaRayon,
          mode: "insensitive",
        },
      },
    });

    if (existingRayon) {
      return res
        .status(409)
        .json(apiResponse(false, null, "Nama rayon sudah ada"));
    }

    const newRayon = await prisma.rayon.create({
      data: {
        namaRayon,
      },
      include: {
        _count: {
          select: {
            keluargas: true,
          },
        },
      },
    });

    return res
      .status(201)
      .json(apiResponse(true, newRayon, "Data rayon berhasil ditambahkan"));
  } catch (error) {
    console.error("Error creating rayon:", error);

    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal menambahkan data rayon", error.message)
      );
  }
}

export default createApiHandler({
  GET: handleGet,
  POST: handlePost,
});
