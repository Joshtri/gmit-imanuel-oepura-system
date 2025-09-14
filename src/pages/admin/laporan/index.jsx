import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Heart,
  Baby,
  GraduationCap,
  Building2,
  MapPin,
} from "lucide-react";

import statisticsService from "@/services/statisticsService";

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Queries
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["statistics-overview"],
    queryFn: () => statisticsService.getOverview(),
  });

  const { data: growth, isLoading: growthLoading } = useQuery({
    queryKey: ["statistics-growth", selectedPeriod, selectedYear],
    queryFn: () => statisticsService.getGrowth({ 
      period: selectedPeriod, 
      year: selectedYear 
    }),
  });

  const { data: demographics, isLoading: demographicsLoading } = useQuery({
    queryKey: ["statistics-demographics"],
    queryFn: () => statisticsService.getDemographics(),
  });

  const overviewData = overview?.data;
  const growthData = growth?.data;
  const demographicsData = demographics?.data;

  const StatCard = ({ title, value, subtitle, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color} mr-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: Eye },
    { id: "growth", label: "Pertumbuhan", icon: TrendingUp },
    { id: "demographics", label: "Demografi", icon: Users },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-2 px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Laporan & Statistik
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Dashboard statistik dan laporan komprehensif GMIT Imanuel Oepura
              </p>
            </div>
            <div className="mt-4 flex space-x-3 lg:mt-0 lg:ml-4">
              <button 
                onClick={() => {
                  refetchOverview();
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Perbarui
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-8 border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-2">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {overviewLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Main Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Jemaat"
                    value={overviewData?.totalMembers?.toLocaleString() || "0"}
                    subtitle="Anggota terdaftar"
                    icon={Users}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Keluarga"
                    value={overviewData?.totalFamilies?.toLocaleString() || "0"}
                    subtitle="Kepala keluarga"
                    icon={Building2}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Laki-laki"
                    value={overviewData?.membersByGender?.male?.toLocaleString() || "0"}
                    subtitle={`${Math.round(((overviewData?.membersByGender?.male || 0) / (overviewData?.totalMembers || 1)) * 100)}% dari total`}
                    icon={Users}
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Perempuan"
                    value={overviewData?.membersByGender?.female?.toLocaleString() || "0"}
                    subtitle={`${Math.round(((overviewData?.membersByGender?.female || 0) / (overviewData?.totalMembers || 1)) * 100)}% dari total`}
                    icon={Users}
                    color="bg-pink-500"
                  />
                </div>

                {/* Sacraments Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                    Statistik Sakramen
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Baby className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-bold text-blue-700">
                        {overviewData?.sacraments?.baptis?.total || 0}
                      </h4>
                      <p className="text-sm text-blue-600">Total Baptis</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {overviewData?.sacraments?.baptis?.thisYear || 0} tahun ini
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <GraduationCap className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-green-700">
                        {overviewData?.sacraments?.sidi?.total || 0}
                      </h4>
                      <p className="text-sm text-green-600">Total Sidi</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {overviewData?.sacraments?.sidi?.thisYear || 0} tahun ini
                      </p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-8 h-8 text-pink-600" />
                      </div>
                      <h4 className="text-xl font-bold text-pink-700">
                        {overviewData?.sacraments?.pernikahan?.total || 0}
                      </h4>
                      <p className="text-sm text-pink-600">Total Pernikahan</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {overviewData?.sacraments?.pernikahan?.thisYear || 0} tahun ini
                      </p>
                    </div>
                  </div>
                </div>

                {/* Age Groups */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Distribusi Kelompok Umur
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <h4 className="text-2xl font-bold text-yellow-700">
                        {overviewData?.ageGroups?.children || 0}
                      </h4>
                      <p className="text-sm text-yellow-600">Anak-anak (0-12)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="text-2xl font-bold text-green-700">
                        {overviewData?.ageGroups?.youth || 0}
                      </h4>
                      <p className="text-sm text-green-600">Remaja (13-25)</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-2xl font-bold text-blue-700">
                        {overviewData?.ageGroups?.adults || 0}
                      </h4>
                      <p className="text-sm text-blue-600">Dewasa (26-59)</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-2xl font-bold text-purple-700">
                        {overviewData?.ageGroups?.elderly || 0}
                      </h4>
                      <p className="text-sm text-purple-600">Lansia (60+)</p>
                    </div>
                  </div>
                </div>

                {/* Rayon Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Distribusi per Rayon
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Rayon</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Keluarga</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Jemaat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overviewData?.rayonDistribution?.map((rayon, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 text-sm font-medium text-gray-900">{rayon.rayon}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{rayon.families}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{rayon.members}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "growth" && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Periode:</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Tahun:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {growthLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Anggota Baru"
                    value={growthData?.summary?.totalNewMembers?.toString() || "0"}
                    subtitle={`Periode ${selectedPeriod === 'monthly' ? 'tahun' : '5 tahun'} terakhir`}
                    icon={Users}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Rata-rata Pertumbuhan"
                    value={growthData?.summary?.averageGrowth?.toString() || "0"}
                    subtitle={`Per ${selectedPeriod === 'monthly' ? 'bulan' : 'tahun'}`}
                    icon={TrendingUp}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Sakramen"
                    value={((growthData?.summary?.totalSacraments?.baptis || 0) + 
                            (growthData?.summary?.totalSacraments?.sidi || 0) + 
                            (growthData?.summary?.totalSacraments?.pernikahan || 0)).toString()}
                    subtitle="Baptis, Sidi, Pernikahan"
                    icon={Calendar}
                    color="bg-purple-500"
                  />
                </div>

                {/* Growth Chart Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Grafik Pertumbuhan Anggota ({selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'})
                  </h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
                      <p className="text-sm text-gray-400">
                        Data: {growthData?.memberGrowth?.length || 0} periode
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sacrament Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tren Sakramen ({selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Periode</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Baptis</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Sidi</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Pernikahan</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {growthData?.sacramentTrends?.map((trend, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 text-sm font-medium text-gray-900">{trend.period}</td>
                            <td className="py-3 text-sm text-center text-blue-600">{trend.baptis}</td>
                            <td className="py-3 text-sm text-center text-green-600">{trend.sidi}</td>
                            <td className="py-3 text-sm text-center text-pink-600">{trend.pernikahan}</td>
                            <td className="py-3 text-sm text-center font-medium text-gray-900">
                              {trend.baptis + trend.sidi + trend.pernikahan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "demographics" && (
          <div className="space-y-6">
            {demographicsLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Anggota"
                    value={demographicsData?.summary?.totalMembers?.toLocaleString() || "0"}
                    subtitle="Jemaat terdaftar"
                    icon={Users}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Keluarga"
                    value={demographicsData?.summary?.totalFamilies?.toLocaleString() || "0"}
                    subtitle="Kepala keluarga"
                    icon={Building2}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Rata-rata Umur"
                    value={`${demographicsData?.summary?.averageAge || 0} tahun`}
                    subtitle="Seluruh jemaat"
                    icon={Calendar}
                    color="bg-purple-500"
                  />
                </div>

                {/* Age Distribution Detail */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribusi Umur Detail
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Kelompok Umur</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Laki-laki</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Perempuan</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demographicsData?.ageDistribution && Object.entries(demographicsData.ageDistribution).map(([ageGroup, data]) => (
                          <tr key={ageGroup} className="border-b border-gray-100">
                            <td className="py-3 text-sm font-medium text-gray-900">{ageGroup} tahun</td>
                            <td className="py-3 text-sm text-center text-blue-600">{data.male}</td>
                            <td className="py-3 text-sm text-center text-pink-600">{data.female}</td>
                            <td className="py-3 text-sm text-center font-medium text-gray-900">{data.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Education Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribusi Pendidikan
                  </h3>
                  <div className="space-y-3">
                    {demographicsData?.education?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{item.count} orang</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pekerjaan Teratas
                  </h3>
                  <div className="space-y-3">
                    {demographicsData?.jobs?.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{item.count} orang</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}