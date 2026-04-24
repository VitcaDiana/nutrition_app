"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2, ChevronRight, User } from "lucide-react";
import Link from "next/link";

export default function NutritionistDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/nutrition/all-patients")
      .then(res => setPatients(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-green-600" size={40}/></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-black uppercase italic">Panou <span className="text-green-600">Specialist</span></h1>
      <div className="grid gap-4">
        {patients.map((p) => {
          // Fix critical: verificăm dacă există dailyLogs și target
          const dailyLog = p.user?.dailyLogs?.[0];
          const consumed = dailyLog?.consumedCalories || 0;
          const target = p.targetCalories || 2000; // Punem 2000 ca rezervă dacă target e 0

          const progress = Math.min(Math.round((consumed / target) * 100), 100);  

          return (
            <Card key={p.id} className="border-none shadow-lg rounded-2xl overflow-hidden hover:scale-[1.01] transition-all">
              <CardContent className="p-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                    <User size={24}/>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{p.user?.name || "Client"}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.goal || "MAINTAIN"}</p>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xs mx-12">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-400 uppercase">Consum azi</span>
                    <span className="text-green-600">{consumed} / {target} kcal</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <Link href={`/chat?userId=${p.user?.id}`}>
                  <button className="p-3 bg-gray-50 rounded-xl hover:bg-green-600 hover:text-white transition-colors">
                    <ChevronRight size={20}/>
                  </button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}