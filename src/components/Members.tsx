'use client'

import membersData from '@/data/members.json'

export default function Members() {
    return (
        <section id="members" className="py-32 bg-[#001210] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#008f7d]/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,244,183,0.1)]">The Team</h2>
                        <p className="text-xl text-[#FFF4B7]/80 font-normal">
                            Architects of the invisible.
                        </p>
                    </div>
                    <div className="hidden md:block text-[#FFF4B7]/60 text-sm font-medium tracking-widest uppercase">
                        San Francisco, CA
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                    {membersData.map((member) => (
                        <div key={member.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-full aspect-square mb-6 border-2 border-[#008f7d]/30 group-hover:border-[#FFF4B7]/50 transition-all duration-500 shadow-[0_0_20px_rgba(0,143,125,0.1)] group-hover:shadow-[0_0_40px_rgba(255,244,183,0.2)]">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001210]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                    <span className="text-[#FFF4B7] text-sm font-medium tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">VIEW PROFILE</span>
                                </div>
                            </div>

                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <h3 className="text-2xl font-medium text-white mb-2 group-hover:text-[#FFF4B7] transition-colors">{member.name}</h3>
                                <p className="text-[#008f7d] text-sm font-bold uppercase tracking-widest bg-[#008f7d]/10 py-1 px-3 rounded-full w-fit mx-auto border border-[#008f7d]/20">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
