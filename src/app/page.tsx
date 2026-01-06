'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import Members from '@/components/Members'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Members />
      <Contact />
    </main>
  )
}
