"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Flame, Dumbbell, Droplets, Pizza, Utensils, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; 
import { useRouter } from "next/navigation"; 

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Redirecționare în funcție de rol
    if (!authLoading && user) {
      if (user.role === "FARMER") {
        router.push("/farmer");
        return;
      }
      if (user.role === "NUTRITIONIST") {
        router.push("/nutritionist"); // Redirecționăm nutriționistul la lista de pacienți
        return;
      }
    }

    // 2. Doar dacă e USER, încărcăm datele de nutriție
    const loadDashboard = async () => {
      if (user?.role !== "USER") return;

      try {
        setError(null);
        const [targets, progress, meals] = await Promise.all([
          api.get("/nutrition/targets"),
          api.get("/nutrition/progress"),
          api.get("/mealplan/today")
        ]);
        setData({ targets: targets.data, progress: progress.data, meals: meals.data || [] });
      } catch (err: any) {
        setError("Profil incomplet sau eroare de conexiune.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.role === "USER") {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  // Loader pentru redirecționare (Nutriționist sau Fermier)
  if (authLoading || (user && user.role !== "USER")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-gray-500 font-bold italic uppercase tracking-widest text-[10px]">
          Redirecționare către panoul de control...
        </p>
      </div>
    );
  }

  // Dacă e eroare sau loading la datele de user
  if (loading && user?.role === "USER") {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  // Calcul date pentru interfața de USER
  const consumed = data?.progress?.consumed ?? 0;
  const target = data?.progress?.target ?? 2000;
  const remaining = Math.max(0, target - consumed);
  const percentage = Math.min(Math.round((consumed / target) * 100), 100) || 0;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic">
            User<span className="text-emerald-600">Stats</span>
          </h1>
          <p className="text-gray-500 font-medium">Salut, {user?.name}! Iată progresul tău:</p>
        </div>
        <Link href="/log-meal">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-7 font-bold shadow-lg transition-all hover:scale-105">
            <PlusCircle className="mr-2" size={20} />
            ADĂUGĂ MASĂ
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CARD CALORII */}
        <Card className="lg:col-span-2 border-none shadow-2xl overflow-hidden relative min-h-[260px] p-0 rounded-[2.5rem]">
          <div className="absolute inset-0 bg-[#064e3b]" />
          <CardContent className="p-8 relative z-10">
            <p className="text-[#34d399] font-black uppercase text-xs mb-2 tracking-widest">Consum Zilnic</p>
            <h2 className="text-6xl font-black text-white flex items-baseline gap-3">
              {consumed} <span className="text-2xl text-[#a7f3d0] opacity-60">/ {target} kcal</span>
            </h2>
            <div className="mt-10">
              <div className="flex justify-between mb-3 text-sm font-bold text-white">
                <span>{percentage}% realizat</span>
                <span className="text-[#34d399]">{remaining} kcal rămase</span>
              </div>
              <div className="w-full bg-black/20 h-5 rounded-full overflow-hidden border border-white/10 p-1">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.5)]" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* METABOLISM */}
        <Card className="bg-white border-none shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-gray-400 font-black tracking-widest">Parametri Corp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-500 font-bold text-sm">BMR</span>
              <span className="font-black text-gray-900 text-lg">{data?.targets?.bmr ?? 0} <span className="text-xs font-normal">kcal</span></span>
            </div>
            <div className="flex justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-500 font-bold text-sm">TDEE</span>
              <span className="font-black text-gray-900 text-lg">{data?.targets?.tdee ?? 0} <span className="text-xs font-normal">kcal</span></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MACRO-NUTRIENȚI */}
      <div className="grid md:grid-cols-3 gap-6">
        <MacroCard title="Proteine" val={data?.progress?.proteinConsumed ?? 0} target={data?.progress?.proteinTarget ?? 150} color="#2563eb" icon={<Dumbbell size={18}/>} />
        <MacroCard title="Grăsimi" val={data?.progress?.fatConsumed ?? 0} target={data?.progress?.fatTarget ?? 70} color="#d97706" icon={<Droplets size={18}/>} />
        <MacroCard title="Carbo" val={data?.progress?.carbsConsumed ?? 0} target={data?.progress?.carbsTarget ?? 250} color="#7c3aed" icon={<Pizza size={18}/>} />
      </div>

      {/* JURNALUL DE AZI */}
      <Card className="border-none shadow-md bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-black flex items-center gap-2 text-gray-800 uppercase italic">
            <Utensils className="text-emerald-600" size={24} /> Jurnalul de azi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {data?.meals?.length > 0 ? (
            <div className="grid gap-4">
              {data.meals.map((meal: any) => (
                <div key={meal.id} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Pizza size={22} /></div>
                    <div>
                      <p className="font-black text-gray-900 text-lg capitalize leading-none mb-1">{meal.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700 text-xl">+{meal.calories} kcal</p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                      {meal.protein}P • {meal.carbs}C • {meal.fat}G
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-300 italic font-bold">Nicio masă înregistrată astăzi.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MacroCard({ title, val, target, color, icon }: any) {
  const p = Math.min(Math.round((val / target) * 100), 100) || 0;
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden border border-gray-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div style={{ backgroundColor: `${color}15`, color: color }} className="p-3 rounded-2xl">{icon}</div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-black text-gray-900">{val}g <span className="text-xs font-bold text-gray-300">/ {target}g</span></p>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, backgroundColor: color }} />
        </div>
      </CardContent>
    </Card>
  );
}