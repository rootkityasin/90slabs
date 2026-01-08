'use client'

export default function Contact() {
    return (
        <section id="contact" className="py-32 bg-[#001210] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#008f7d]/10 to-transparent pointer-events-none"></div>
            {/* Big Blur behind */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#008f7d]/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <span className="text-[#FFF4B7] font-mono text-sm tracking-widest uppercase mb-6 block animate-pulse drop-shadow-[0_0_10px_rgba(255,244,183,0.3)]">Start Your Journey</span>

                <h2 className="text-5xl md:text-8xl font-bold mb-10 text-white tracking-tighter leading-none max-w-4xl drop-shadow-[0_0_20px_rgba(0,143,125,0.4)]">
                    Ready to make waves?
                </h2>

                <p className="text-xl md:text-2xl text-[#FFF4B7]/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Let's build something extraordinary together. Reach out to us for your next digital venture.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <a href="mailto:hello@90sx.agency" className="inline-flex items-center justify-center px-12 py-5 bg-[#FFF4B7] text-[#001210] font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,244,183,0.4)]">
                        Get in Touch
                    </a>
                </div>

                <footer className="mt-40 w-full border-t border-[#FFF4B7]/20 pt-10 flex flex-col md:flex-row justify-between items-center text-[#FFF4B7]/60 text-sm font-mono">
                    <p>&copy; {new Date().getFullYear()} 90sX Agency.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </footer>
            </div>
        </section>
    )
}
