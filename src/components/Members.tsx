'use client'

import membersData from '@/data/members.json'

export default function Members() {
    return (
        <section id="members" className="py-32 bg-black relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">The Team</h2>
                        <p className="text-xl text-gray-400 font-normal">
                            Architects of the invisible.
                        </p>
                    </div>
                    <div className="hidden md:block text-gray-500 text-sm">
                        San Francisco, CA
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                    {membersData.map((member) => (
                        <div key={member.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-full aspect-square mb-6 border border-white/10 group-hover:border-white/20 transition-all duration-500">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <h3 className="text-xl font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">{member.name}</h3>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
