import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  }

  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Get user with majelis info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        majelis: {
          include: {
            rayon: true
          }
        }
      }
    });

    if (!user || !user.majelis) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. User bukan majelis",
      });
    }

    const rayonId = user.majelis.idRayon;

    // Get statistics berdasarkan rayon
    const [
      totalJemaat,
      totalKeluarga,
      jadwalBulanIni,
      baptisBulanIni,
      sidiTahunIni
    ] = await Promise.all([
      // Total jemaat di rayon ini
      prisma.jemaat.count({
        where: {
          keluarga: {
            idRayon: rayonId
          }
        }
      }),

      // Total keluarga di rayon ini  
      prisma.keluarga.count({
        where: {
          idRayon: rayonId
        }
      }),

      // Jadwal ibadah bulan ini untuk rayon ini
      prisma.jadwalIbadah.count({
        where: {
          OR: [
            { idRayon: rayonId },
            { 
              keluarga: {
                idRayon: rayonId
              }
            }
          ],
          tanggal: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      }),

      // Baptis bulan ini untuk jemaat di rayon ini
      prisma.baptis.count({
        where: {
          jemaat: {
            keluarga: {
              idRayon: rayonId
            }
          },
          tanggal: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      }),

      // Sidi tahun ini untuk jemaat di rayon ini
      prisma.sidi.count({
        where: {
          jemaat: {
            keluarga: {
              idRayon: rayonId
            }
          },
          tanggal: {
            gte: new Date(new Date().getFullYear(), 0, 1),
            lt: new Date(new Date().getFullYear() + 1, 0, 1)
          }
        }
      })
    ]);

    // Get recent jadwal ibadah (5 terbaru)
    const recentJadwal = await prisma.jadwalIbadah.findMany({
      where: {
        OR: [
          { idRayon: rayonId },
          { 
            keluarga: {
              idRayon: rayonId
            }
          }
        ],
        tanggal: {
          gte: new Date()
        }
      },
      include: {
        jenisIbadah: true,
        kategori: true,
        pemimpin: true,
        keluarga: {
          include: {
            rayon: true
          }
        },
        rayon: true
      },
      orderBy: {
        tanggal: 'asc'
      },
      take: 5
    });

    // Get upcoming events this month
    const upcomingEvents = await prisma.jadwalIbadah.findMany({
      where: {
        OR: [
          { idRayon: rayonId },
          { 
            keluarga: {
              idRayon: rayonId
            }
          }
        ],
        tanggal: {
          gte: new Date(),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      },
      include: {
        jenisIbadah: true,
        kategori: true
      },
      orderBy: {
        tanggal: 'asc'
      },
      take: 3
    });

    return res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalJemaat,
          totalKeluarga, 
          jadwalBulanIni,
          baptisBulanIni,
          sidiTahunIni
        },
        rayon: user.majelis.rayon,
        recentJadwal,
        upcomingEvents
      },
      message: "Data dashboard berhasil diambil",
    });

  } catch (error) {
    console.error("Error fetching majelis dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}