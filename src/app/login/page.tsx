import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold">Loading system...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
