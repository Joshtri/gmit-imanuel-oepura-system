import EmptyState, { EmptyStates } from "../common/EmptyState";

// Demo halaman untuk menunjukkan berbagai penggunaan EmptyState
export default function EmptyStateDemo() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">EmptyState Demo</h1>

      {/* Basic Usage */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Basic Usage</h2>
        <div className="border rounded-lg p-4">
          <EmptyState />
        </div>
      </section>

      {/* Different Types */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">2. Different Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Search Empty</h3>
            <EmptyState size="sm" type="search" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Users Empty</h3>
            <EmptyState size="sm" type="users" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Calendar Empty</h3>
            <EmptyState size="sm" type="calendar" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Gallery Empty</h3>
            <EmptyState size="sm" type="gallery" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Error State</h3>
            <EmptyState size="sm" type="error" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Not Found</h3>
            <EmptyState size="sm" type="nodata" />
          </div>
        </div>
      </section>

      {/* With Action Button */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">3. With Action Button</h2>
        <div className="border rounded-lg p-4">
          <EmptyState
            actionText="Tambah Jemaat"
            type="users"
            onAction={() => alert("Navigating to add user...")}
          />
        </div>
      </section>

      {/* Custom Content */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Custom Content</h2>
        <div className="border rounded-lg p-4">
          <EmptyState
            actionText="Buat Laporan"
            description="Anda belum memiliki laporan keuangan untuk periode ini. Mulai dengan menambahkan transaksi pertama Anda."
            size="lg"
            title="Belum Ada Laporan"
            onAction={() => alert("Creating report...")}
          />
        </div>
      </section>

      {/* Different Sizes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Different Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Small</h3>
            <EmptyState size="sm" type="inbox" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Medium (Default)</h3>
            <EmptyState size="md" type="inbox" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Large</h3>
            <EmptyState size="lg" type="inbox" />
          </div>
        </div>
      </section>

      {/* Using Predefined Variants */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          6. Using Predefined Variants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">EmptyStates.NoData</h3>
            <EmptyStates.NoData size="sm" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">EmptyStates.NoSearch</h3>
            <EmptyStates.NoSearch size="sm" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">EmptyStates.Error</h3>
            <EmptyStates.Error size="sm" />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">EmptyStates.NotFound</h3>
            <EmptyStates.NotFound size="sm" />
          </div>
        </div>
      </section>

      {/* Real World Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">7. Real World Examples</h2>

        <div className="space-y-6">
          {/* Jemaat List Empty */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Daftar Jemaat Kosong</h3>
            <EmptyState
              actionText="Tambah Jemaat"
              description="Anda belum memiliki data jemaat yang terdaftar. Mulai dengan menambahkan jemaat pertama."
              title="Belum Ada Data Jemaat"
              type="users"
              onAction={() => alert("Navigating to add jemaat...")}
            />
          </div>

          {/* Ibadah Schedule Empty */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Jadwal Ibadah Kosong</h3>
            <EmptyState
              actionText="Buat Jadwal"
              description="Belum ada jadwal ibadah yang dijadwalkan. Tambahkan jadwal ibadah pertama untuk mulai mengelola kegiatan gereja."
              title="Belum Ada Jadwal Ibadah"
              type="calendar"
              onAction={() => alert("Creating schedule...")}
            />
          </div>

          {/* Search Results Empty */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Hasil Pencarian Kosong</h3>
            <EmptyState
              description="Pencarian untuk 'John Doe' tidak menghasilkan hasil apapun. Coba gunakan kata kunci yang berbeda atau periksa ejaan."
              title="Tidak Ditemukan Hasil"
              type="search"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
