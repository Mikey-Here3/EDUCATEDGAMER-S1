import AdminSidebar from '@/components/layout/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#050507]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col sm:pl-64">
        <main className="flex-1 min-h-screen bg-[#050507]">
          {children}
        </main>
      </div>
    </div>
  )
}
