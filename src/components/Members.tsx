"use client";

import { useEffect, useState } from "react";
import { AvatarGroup, AvatarGroupTooltip } from "@/components/animate-ui/components/animate/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  name: string;
  role?: string;
  image?: string;
}

export default function Members() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch("/api/members");
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          const users: User[] = json.map((m: any) => ({ 
            name: m.name, 
            role: m.role, 
            image: m.image 
          }));
          setMembers(users);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section id="members" className="py-32 bg-[#fafaf7] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-10 h-10 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) return null;
  
  const AVATARS = members.map(m => ({
    src: m.image || undefined,
    fallback: m.name.split(" ").map((s: string) => s[0]).join("").toUpperCase(),
    tooltip: m.role ? `${m.name} — ${m.role}` : m.name,
  }));

  return (
    <section id="members" className="py-32 bg-[#fafaf7] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#008f7d]/08 rounded-full blur-[80px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight mb-4">The Team</h2>
            <p className="text-xl text-[#4a5568] font-normal">Architects of the invisible.</p>
          </div>
          <div className="hidden md:block text-[#4a5568] text-sm font-medium tracking-widest uppercase">San Francisco, CA</div>
        </div>

        <div className="flex items-center justify-center">
          <AvatarGroup>
            {AVATARS.map((avatar, index) => (
              <Avatar key={index} className="size-12 border-3 border-background hover:scale-110 transition-transform duration-200 cursor-pointer">
                {avatar.src ? (
                  <AvatarImage
                    src={avatar.src}
                    alt={avatar.tooltip}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#008f7d] to-[#006b5c] text-white">
                    {avatar.fallback}
                  </AvatarFallback>
                )}
                <AvatarGroupTooltip>{avatar.tooltip}</AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
    </section>
  );
}