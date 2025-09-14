// ===== 1. API ROUTE - /api/keuangan/pengeluaran/route.js =====
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Ambil struktur pengeluaran
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodeId = searchParams.get("periodeId");
    const includeAnggaran = searchParams.get("anggaran") === "true";

    // Ambil kategori pengeluaran
    const kategoriPengeluaran = await prisma.kategoriKeuangan.findFirst({
      where: { kode: "B" }, // Pengeluaran
    });

    if (!kategoriPengeluaran) {
      return NextResponse.json(
        {
          error: "Kategori pengeluaran belum di-setup",
        },
        { status: 404 }
      );
    }

    // Ambil semua item pengeluaran
    const items = await prisma.itemKeuangan.findMany({
      where: {
        kategoriId: kategoriPengeluaran.id,
        isActive: true,
      },
      include: {
        ...(includeAnggaran &&
          periodeId && {
            AnggaranItem: {
              where: { periodeId },
            },
          }),
      },
      orderBy: [{ level: "asc" }, { urutan: "asc" }],
    });

    // Build tree structure
    const tree = buildItemTree(items);

    return NextResponse.json({
      success: true,
      data: {
        kategori: kategoriPengeluaran,
        items: items,
        tree: tree,
        summary: {
          totalItems: items.length,
          totalTargetAnggaran: items.reduce(
            (sum, item) => sum + Number(item.totalTarget || 0),
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching pengeluaran:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pengeluaran",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== 5. HELPER FUNCTION =====
function buildItemTree(items) {
  const itemMap = new Map();
  const rootItems = [];

  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const itemWithChildren = itemMap.get(item.id);

    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(itemWithChildren);
      }
    } else {
      rootItems.push(itemWithChildren);
    }
  });

  return rootItems.sort((a, b) => a.urutan - b.urutan);
}
