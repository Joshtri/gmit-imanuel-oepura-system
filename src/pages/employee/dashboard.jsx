import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import { User, Briefcase, Clock, FileText, Calendar } from "lucide-react";

function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles="EMPLOYEE">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Pegawai
                  </h1>
                  <p className="text-sm text-gray-600">GMIT Imanuel Oepura</p>
                </div>
              </div>
              {/* <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <LogoutButton variant="secondary" />
              </div> */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                {/* <div className="flex-shrink-0">
                  <Briefcase className="h-12 w-12 text-orange-600" />
                </div> */}
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selamat datang, {user?.username}!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Anda masuk sebagai Employee. Kelola tugas dan kegiatan
                    harian Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tugas Hari Ini
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Persiapan ibadah minggu
                    </p>
                    <p className="text-xs text-gray-500">Deadline: 10:00 WIB</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 mr-3"
                    checked
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-through">
                      Update data jemaat
                    </p>
                    <p className="text-xs text-gray-500">Selesai: 09:30 WIB</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Selesai
                  </span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Koordinasi dengan majelis
                    </p>
                    <p className="text-xs text-gray-500">Deadline: 15:00 WIB</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Dalam Proses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Jam Kerja Hari Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        6.5 jam
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
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tugas Selesai
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        12/15
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
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Kehadiran Bulan Ini
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        22/24
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
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rating Performa
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        4.8/5.0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Akses Cepat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Clock className="h-6 w-6 text-orange-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Absensi</p>
                    <p className="text-xs text-gray-500">Clock in/out harian</p>
                  </div>
                </button>

                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Laporan Tugas
                    </p>
                    <p className="text-xs text-gray-500">Buat laporan harian</p>
                  </div>
                </button>

                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Jadwal Kerja
                    </p>
                    <p className="text-xs text-gray-500">
                      Lihat jadwal minggu ini
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
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

export default EmployeeDashboard;
