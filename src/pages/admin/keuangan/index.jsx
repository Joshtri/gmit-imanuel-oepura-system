import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Calendar,
  List,
  BarChart3,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useRouter } from "next/router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import AdminLayout from "@/components/layout/AdminLayout";

export default function KeuanganDashboard() {
  const router = useRouter();

  const statsCards = [
    {
      title: "Total Penerimaan",
      value: "Rp 45.250.000",
      change: "+12.5%",
      changeType: "positive",
      icon: TrendingUp,
      description: "Bulan ini",
    },
    {
      title: "Total Pengeluaran",
      value: "Rp 38.750.000",
      change: "-8.2%",
      changeType: "negative",
      icon: TrendingDown,
      description: "Bulan ini",
    },
    {
      title: "Saldo",
      value: "Rp 6.500.000",
      change: "±0%",
      changeType: "neutral",
      icon: Calculator,
      description: "Sisa anggaran",
    },
    {
      title: "Target Anggaran",
      value: "Rp 500.000.000",
      change: "13.2%",
      changeType: "positive",
      icon: BarChart3,
      description: "Tercapai tahun ini",
    },
  ];

  const quickActions = [
    {
      title: "Input Penerimaan",
      description: "Catat penerimaan baru",
      icon: PlusCircle,
      color: "bg-green-500",
      href: "/admin/keuangan/penerimaan/create",
    },
    {
      title: "Input Pengeluaran",
      description: "Catat pengeluaran baru",
      icon: PlusCircle,
      color: "bg-red-500",
      href: "/admin/keuangan/pengeluaran/create",
    },
    {
      title: "Kelola Item",
      description: "Master data item keuangan",
      icon: List,
      color: "bg-blue-500",
      href: "/admin/data-master/keuangan/item",
    },
    {
      title: "Periode Anggaran",
      description: "Kelola periode anggaran",
      icon: Calendar,
      color: "bg-purple-500",
      href: "/admin/data-master/keuangan/periode",
    },
  ];

  const masterDataLinks = [
    {
      title: "Kategori Keuangan",
      description: "Kelola kategori utama (Penerimaan/Pengeluaran)",
      href: "/admin/data-master/keuangan/kategori",
    },
    {
      title: "Item Keuangan",
      description: "Kelola item keuangan dengan struktur hierarkis",
      href: "/admin/data-master/keuangan/item",
    },
    {
      title: "Periode Anggaran",
      description: "Kelola periode anggaran dan target",
      href: "/admin/data-master/keuangan/periode",
    },
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Keuangan" },
        ]}
        description="Sistem manajemen keuangan GMIT Imanuel Oepura"
        title="Keuangan"
      />

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className={`${getChangeColor(stat.changeType)} mr-1`}>
                    {stat.change}
                  </span>
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className="flex flex-col items-center p-6 h-auto hover:bg-gray-50"
                  variant="outline"
                  onClick={() => router.push(action.href)}
                >
                  <div
                    className={`p-3 rounded-full ${action.color} text-white mb-3`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {action.title}
                  </span>
                  <span className="text-sm text-gray-500 text-center mt-1">
                    {action.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Master Data */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Master Data Keuangan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {masterDataLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(link.href)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {link.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Kelola
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Transaksi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada transaksi</p>
                  <p className="text-xs mt-1">
                    Mulai dengan menambahkan transaksi pertama
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/admin/keuangan/transaksi")}
                >
                  Lihat Semua Transaksi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Status Sistem Keuangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-500">Kategori Keuangan</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-500">Item Keuangan</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-500">Periode Aktif</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900">
                Mulai Setup Keuangan
              </h4>
              <p className="text-blue-700 text-sm mt-1">
                Untuk menggunakan sistem keuangan, mulai dengan:
              </p>
              <ol className="text-blue-700 text-sm mt-2 ml-4 list-decimal">
                <li>Buat kategori keuangan (Penerimaan & Pengeluaran)</li>
                <li>Tambahkan item keuangan dengan struktur hierarkis</li>
                <li>Setup periode anggaran</li>
                <li>Mulai input transaksi</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

KeuanganDashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
