import { Suspense } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { SignUpForm } from '@/components/auth/signup-form'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold">Loading system...</div>}>
          <SignUpForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
