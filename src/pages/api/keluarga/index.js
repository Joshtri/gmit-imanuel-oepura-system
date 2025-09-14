import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { parseQueryParams } from "@/lib/queryParams";
import { createApiHandler } from "@/lib/apiHandler";
import jwt from "jsonwebtoken";

async function handleGet(req, res) {
  try {
    // Get token from header untuk majelis filter
    const token = req.headers.authorization?.replace("Bearer ", "");
    let rayonFilter = {};
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Get user info to check if majelis
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            majelis: true
          }
        });

        // If user is majelis, filter by rayon
        if (user && user.majelis && user.role === 'MAJELIS') {
          rayonFilter = {
            idRayon: user.majelis.idRayon
          };
        }
      } catch (error) {
        console.log("Token validation error:", error.message);
        // Continue without filter if token invalid
      }
    }

    const { pagination, sort, where } = parseQueryParams(req.query, {
      searchField: "kepalaKeluarga",
      defaultSortBy: "noBagungan",
    });

    // Combine rayon filter with existing where clause
    const finalWhere = {
      ...where,
      ...rayonFilter
    };

    const total = await prisma.keluarga.count({ where: finalWhere });

    const items = await prisma.keluarga.findMany({
      where: finalWhere,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
      include: {
        alamat: {
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
        },
        statusKeluarga: true,
        statusKepemilikanRumah: true,
        keadaanRumah: true,
        rayon: true,
        jemaats: {
          include: {
            statusDalamKeluarga: true,
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
    console.error("Error fetching keluarga:", error);
    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal mengambil data keluarga", error.message)
      );
  }
}

async function handlePost(req, res) {
  try {
    const data = req.body;

    const newKeluarga = await prisma.keluarga.create({
      data,
      include: {
        alamat: {
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
        },
        statusKeluarga: true,
        statusKepemilikanRumah: true,
        keadaanRumah: true,
        rayon: true,
      },
    });

    return res
      .status(201)
      .json(apiResponse(true, newKeluarga, "Data berhasil ditambahkan"));
  } catch (error) {
    console.error("Error creating keluarga:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal menambahkan data keluarga",
          error.message
        )
      );
  }
}

export default createApiHandler({
  GET: handleGet,
  POST: handlePost,
});
