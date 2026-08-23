import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-8 py-16">
        <h1 className="animate-fade-up font-instrument text-3xl font-semibold text-black dark:text-white">
          {title}
        </h1>
        <div className="animate-fade-up flex flex-col gap-4 font-instrument text-black/70 [animation-delay:80ms] dark:text-white/70">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
