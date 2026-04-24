"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  UserCircle, 
  Settings, 
  ChefHat, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Refrigerator, 
  Heart,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const linkStyle = (href: string) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
      pathname === href
        ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
        : "hover:bg-gray-800 text-gray-300"
    }`;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 shadow-xl flex flex-col border-r border-gray-800">
      {/* Brand Logo */}
      <h2 className="text-2xl font-bold mb-10 text-green-500 tracking-tight italic">
        NutriApp
      </h2>

      <nav className="flex flex-col gap-2 flex-1">
        {/* --- SECȚIUNE USER (Acces complet la funcții de self-help) --- */}
        {user?.role === 'USER' && (
          <>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 px-3">Meniul Meu</p>
            <Link href="/dashboard" className={linkStyle("/dashboard")}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link href="/profile" className={linkStyle("/profile")}>
              <UserCircle size={18} /> Nutrition Profile
            </Link>
            <Link href="/preferences" className={linkStyle("/preferences")}>
              <Settings size={18} /> Preferences
            </Link>
            <Link href="/ingredients" className={linkStyle("/ingredients")}>
              <Refrigerator size={18} /> Frigider
            </Link>
            <Link href="/recipes" className={linkStyle("/recipes")}>
              <ChefHat size={18} /> Recipes
            </Link>
            <Link href="/favorites" className={linkStyle("/favorites")}>
              <Heart size={18} /> Favorites
            </Link>
            <Link href="/chat" className={linkStyle("/chat")}>
              <MessageSquare size={18} /> Chat Expert
            </Link>
          </>
        )}

        {/* --- SECȚIUNE NUTRITIONIST (Fără rețete, doar monitorizare) --- */}
        {user?.role === 'NUTRITIONIST' && (
          <>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 px-3">Panou Specialist</p>
            <Link href="/nutritionist" className={linkStyle("/nutritionist")}>
              <Users size={18} /> Listă Pacienți
            </Link>
            <Link href="/chat" className={linkStyle("/chat")}>
              <MessageSquare size={18} /> Mesaje Clienți
            </Link>
            {/* Nutriționistul vede Marketplace-ul pentru a recomanda produse, dar atât */}
          </>
        )}

        {/* --- SECȚIUNE FARMER --- */}
        {user?.role === 'FARMER' && (
          <>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 px-3">Gestiune Fermă</p>
            <Link href="/farmer" className={linkStyle("/farmer")}>
              <ShoppingBag size={18} /> My Farm Store
            </Link>
          </>
        )}

        {/* --- SECȚIUNE COMUNĂ --- */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1 px-3">Comunitate</p>
          <Link href="/marketplace" className={linkStyle("/marketplace")}>
            <ShoppingBag size={18} /> Marketplace
          </Link>
        </div>
      </nav>

      {/* Profile & Logout */}
      <div className="pt-6 border-t border-gray-800">
        <div className="mb-4 px-3 py-2 bg-gray-800/50 rounded-lg">
          <p className="text-xs font-bold text-green-400 truncate">{user?.email}</p>
          <span className="text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-bold mt-1 inline-block uppercase">
            {user?.role}
          </span>
        </div>
        
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full text-left px-3 py-2 text-sm font-bold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}