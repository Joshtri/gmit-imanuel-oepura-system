import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import PageTitle from "@/components/ui/PageTitle";
import {
  User,
  Shield,
  Users,
  FileText,
  Calendar,
  Home,
  Clock,
  UserCheck,
  UserPlus,
  Megaphone,
  UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboardService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useRouter } from "next/router";

function MajelisDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["majelis-dashboard"],
    queryFn: () => dashboardService.getMajelisDashboard(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const stats = dashboardData?.statistics || {};
  const rayon = dashboardData?.rayon || {};
  const recentJadwal = dashboardData?.recentJadwal || [];
  const upcomingEvents = dashboardData?.upcomingEvents || [];

  if (error) {
    console.error("Dashboard error:", error);
  }

  // Navigation handlers
  const handleNavigateTo = (path) => {
    router.push(path);
  };

  return (
    <ProtectedRoute allowedRoles="MAJELIS">
      <PageTitle
        title="Dashboard Majelis"
        description={`Dashboard untuk Majelis ${rayon.namaRayon || ""} - GMIT Imanuel Oepura`}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Majelis
                  </h1>
                  <p className="text-sm text-gray-600">
                    {rayon.namaRayon
                      ? `${rayon.namaRayon} - GMIT Imanuel Oepura`
                      : "GMIT Imanuel Oepura"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selamat datang, {user?.username}!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Anda masuk sebagai Majelis {rayon.namaRayon || ""}. Kelola
                    administrasi gereja dengan bijak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white overflow-hidden shadow rounded-lg animate-pulse"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Jemaat
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalJemaat || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Home className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Keluarga
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalKeluarga || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Ibadah Bulan Ini
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.jadwalBulanIni || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCheck className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Baptis Bulan Ini
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.baptisBulanIni || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserPlus className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Sidi Tahun Ini
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.sidiTahunIni || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Akses Cepat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleNavigateTo("/majelis/pengumuman")}
                  className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <Megaphone className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Pengumuman Rayon
                    </p>
                    <p className="text-xs text-gray-500">
                      Kelola pengumuman untuk rayon
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigateTo("/majelis/jadwal-ibadah")}
                  className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <Calendar className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Jadwal Ibadah
                    </p>
                    <p className="text-xs text-gray-500">
                      Atur jadwal kegiatan ibadah
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigateTo("/majelis/keluarga")}
                  className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <UsersRound className="h-6 w-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Data Keluarga
                    </p>
                    <p className="text-xs text-gray-500">
                      Lihat data keluarga di rayon
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informasi Akun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No. WhatsApp
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user?.noWhatsapp || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user?.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default MajelisDashboard;
