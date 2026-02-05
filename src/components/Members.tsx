"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AvatarGroup } from "@/components/animate-ui/components/animate/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaReact, FaAws, FaDocker, FaNodeJs, FaGithub,
  FaTwitter, FaLinkedin, FaInstagram
} from "react-icons/fa";
import {
  SiNextdotjs, SiVercel, SiRedux, SiTypescript
} from "react-icons/si";

// --- Types ---
interface User {
  name: string;
  role?: string;
  image?: string;
}

// --- Tech Stack Config ---
const iconConfigs = [
  { Icon: FaReact, color: "#61DAFB" },
  { Icon: FaAws, color: "#FF9900" },
  { Icon: FaDocker, color: "#2496ED" },
  { Icon: FaNodeJs, color: "#339933" },
  { Icon: SiNextdotjs, color: "#000000" },
  { Icon: SiVercel, color: "#000000" },
  { Icon: SiRedux, color: "#764ABC" },
  { Icon: SiTypescript, color: "#3178C6" },
  { Icon: FaGithub, color: "#181717" },
  { Icon: FaTwitter, color: "#1DA1F2" },
  { Icon: FaLinkedin, color: "#0077B5" },
  { Icon: FaInstagram, color: "#E1306C" },
];

// --- Sub-component for Team Member ---
const MemberItem = ({ member }: { member: User }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fallback = member.name.split(" ").map((s) => s[0]).join("").toUpperCase();

  return (
    <div
      className="relative z-10 hover:z-[110]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.6, y: 10, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 z-[120] pointer-events-none"
          >
            <div className="relative bg-white text-black px-4 py-2 rounded-xl border-[0.5px] border-black shadow-xl flex flex-col items-center min-w-[130px]">
              <span className="text-sm font-bold whitespace-nowrap">{member.name}</span>
              {member.role && <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{member.role}</span>}
              <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-[1px] border-r-[1px] border-black rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
      >
        <Avatar className="size-14 md:size-16 border-4 border-white cursor-pointer bg-zinc-100 shadow-sm transition-shadow hover:shadow-md">
          {member.image ? (
            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-[#008f7d] text-white text-xs">{fallback}</AvatarFallback>
          )}
        </Avatar>
      </motion.div>
    </div>
  );
};

// --- Main Section ---
export default function TeamAndStack() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/members");
        if (res.ok) setMembers(await res.json());
      } catch (err) {
        console.error(err);
        // Fallback data for preview if API fails
        setMembers([
          { name: "Alex Rivera", role: "Lead Dev" },
          { name: "Sarah Chen", role: "UI/UX" },
          { name: "Marcus Volt", role: "DevOps" }
        ]);
      } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  return (
    <section id="members" className="relative flex flex-col md:flex-row items-center justify-between bg-white overflow-hidden py-16 md:py-24">

      {/* LEFT SIDE: Typography + Team */}
      <div className="w-full md:w-1/2 p-8 md:p-16 z-20 pl-24">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[#008f7d] font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
          >
            The Human Element
          </motion.span>

          <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 leading-[1.1] mb-6">
            Crafted by experts, <br />
            <span className="text-zinc-300">driven by code.</span>
          </h2>

          <p className="text-lg text-zinc-600 mb-12 leading-relaxed max-w-md">
            Our collective expertise lives at the intersection of design and
            high-performance engineering. We don't just build apps; we architect
            digital futures.
          </p>

          <div className="space-y-6 pl-34">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-zinc-300" />
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                The Core Team
              </p>
            </div>

            <AvatarGroup className="-space-x-4 justify-start">
              {!loading && members.map((m, i) => <MemberItem key={i} member={m} />)}
              <div className="size-14 md:size-16 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-[#008f7d] hover:border-[#008f7d] transition-all cursor-pointer bg-zinc-50/50 translate-x-2">
                <span className="text-xl font-light">+</span>
              </div>
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Orbit Animation */}
      <div className="relative w-full md:w-1/2 h-[35rem] md:h-[45rem] flex items-center justify-start overflow-hidden">
        {/* Subtle Vertical Label */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 -rotate-90 origin-center whitespace-nowrap">
            Integrated Technology Stack
          </p>
        </div>
        <div className="relative w-[50rem] h-[50rem] translate-x-[15%] md:translate-x-[30%] flex items-center justify-center">
          {/* Center Tech Logo */}
          <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center border border-gray-100">
            <FaReact className="w-12 h-12 text-[#61DAFB] animate-pulse" />
          </div>
          {/* Orbiting Circles */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${12 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;
            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed border-gray-300 dark:border-gray-700"
                style={{
                  width: size,
                  height: size,
                  animation: `spin ${15 + orbitIdx * 8}s linear infinite`,
                }}
              >
                {iconConfigs
                  .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);
                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-100 dark:border-gray-700"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <cfg.Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: cfg.color }} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}