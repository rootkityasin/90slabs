'use client'

import Navbar from '@/components/Navbar'
import HeroAbout from '@/components/HeroAbout'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import Members from '@/components/Members'
import Contact from '@/components/Contact'
import LayoutBackground from '@/components/LayoutBackground'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      <LayoutBackground>
        <HeroAbout />
      </LayoutBackground>
      <Services />
      <Projects />
      <Members />
      <Contact />
    </main>
  )
}
