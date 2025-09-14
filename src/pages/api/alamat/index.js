import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { parseQueryParams } from "@/lib/queryParams";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { pagination, sort, where } = parseQueryParams(req.query, {
      searchField: "jalan",
      defaultSortBy: "jalan",
    });

    const total = await prisma.alamat.count({ where });

    const items = await prisma.alamat.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
      include: {
        kelurahan: {
          include: {
            kecamatan: {
              include: {
                kotaKab: {
                  include: {
                    provinsi: true,
                  },
                },
              },
            },
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
    console.error("Error fetching alamat:", error);

    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal mengambil data alamat", error.message)
      );
  }
}

async function handlePost(req, res) {
  try {
    const data = req.body;

    // Validate kelurahan exists
    const kelurahan = await prisma.kelurahan.findUnique({
      where: { id: data.idKelurahan },
    });

    if (!kelurahan) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Kelurahan tidak ditemukan"));
    }

    const newAlamat = await prisma.alamat.create({
      data,
      include: {
        kelurahan: {
          include: {
            kecamatan: {
              include: {
                kotaKab: {
                  include: {
                    provinsi: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res
      .status(201)
      .json(apiResponse(true, newAlamat, "Data berhasil ditambahkan"));
  } catch (error) {
    console.error("Error creating alamat:", error);

    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal menambahkan data alamat", error.message)
      );
  }
}

export default createApiHandler({
  GET: handleGet,
  POST: handlePost,
});
