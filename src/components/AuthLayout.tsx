import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import heroIllustration from '../assets/hero-illustration.jpg'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1296px] flex-1 flex-col items-center gap-12 px-8 py-16 md:flex-row md:justify-center md:gap-24">
        <img
          src={heroIllustration}
          alt="Adolescentes usando Safe Kids para ubicarse en su ciudad"
          className="h-auto w-full max-w-[602px] animate-fade-up rounded-lg object-cover transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02]"
        />

        <div className="hidden self-stretch border-l border-divider md:block" />

        <div className="w-full max-w-md animate-fade-up [animation-delay:100ms]">{children}</div>
      </main>

      <Footer />
    </div>
  )
}
