"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Calculator, Loader2, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Baza de date demonstrativă (Până legăm un API real)
const FOOD_DATABASE: Record<string, any> = {
  "piept de pui": { kcal: 165, p: 31, c: 0, f: 3.6 },
  "ou": { kcal: 155, p: 13, c: 1.1, f: 11 },
  "orez": { kcal: 130, p: 2.7, c: 28, f: 0.3 },
  "banana": { kcal: 89, p: 1.1, c: 23, f: 0.3 },
  "avocado": { kcal: 160, p: 2, c: 9, f: 15 },
};

export default function LogMealPage() {
  const router = useRouter();
  const [mealTitle, setMealTitle] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [ingName, setIngName] = useState("");
  const [weight, setWeight] = useState(100);

  const addIngredient = () => {
    const nameLower = ingName.toLowerCase();
    // Căutăm în baza noastră sau punem valori default dacă nu găsim
    const info = FOOD_DATABASE[nameLower] || { kcal: 50, p: 2, c: 10, f: 1 }; 
    
    const calculated = {
      name: ingName,
      weight: weight,
      calories: Math.round((info.kcal * weight) / 100),
      protein: Math.round((info.p * weight) / 100),
      carbs: Math.round((info.c * weight) / 100),
      fat: Math.round((info.f * weight) / 100),
    };

    setIngredients([...ingredients, calculated]);
    setIngName("");
    setWeight(100);
  };

  const totals = ingredients.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-900">
      <Link href="/dashboard" className="flex items-center text-emerald-600 font-bold hover:underline">
        <ArrowLeft size={18} className="mr-2" /> ÎNAPOI LA DASHBOARD
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl bg-white p-6 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 text-slate-800">Adaugă în Rețetă</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Ce ai mâncat?</label>
                <div className="relative">
                  <Input 
                    className="pl-10 bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl" 
                    placeholder="ex: Piept de pui" 
                    value={ingName} 
                    onChange={(e) => setIngName(e.target.value)} 
                  />
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Cantitate (grame)</label>
                <Input 
                  type="number" 
                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl" 
                  value={weight} 
                  onChange={(e) => setWeight(+e.target.value)} 
                />
              </div>
            </div>

            <Button 
              onClick={addIngredient} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-emerald-100"
            >
              <Plus className="mr-2" /> ADAUGĂ INGREDIENT
            </Button>
          </Card>

          {/* Lista de ingrediente cu text vizibil (negru) */}
          <div className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <p className="font-bold text-slate-900 capitalize">{ing.name}</p>
                  <p className="text-xs text-slate-500">{ing.weight}g — {ing.calories} kcal | P: {ing.protein}g | C: {ing.carbs}g | G: {ing.fat}g</p>
                </div>
                <Button variant="outline" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="text-red-500 border-red-100 hover:bg-red-50">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* REZUMAT VIZIBIL */}
        <div className="space-y-6">
          <Card className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Total Calculat</p>
              <h3 className="text-5xl font-black mb-8">{totals.calories} <span className="text-lg opacity-50 font-normal">kcal</span></h3>
              
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Proteine</p>
                  <p className="text-xl font-black">{totals.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Carbo</p>
                  <p className="text-xl font-black">{totals.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Grăsimi</p>
                  <p className="text-xl font-black">{totals.fat}g</p>
                </div>
              </div>
            </div>
            <Calculator className="absolute -right-10 -bottom-10 text-white/5" size={200} />
          </Card>

          <Input 
            className="h-14 rounded-2xl border-slate-200 text-lg font-bold text-slate-900 px-6 shadow-sm" 
            placeholder="Numele Mesei (ex: Prânz)" 
            value={mealTitle} 
            onChange={(e) => setMealTitle(e.target.value)} 
          />
          
          <Button 
            onClick={async () => {
                setLoading(true);
                try {
                    await api.post("/mealplan", { title: mealTitle, ...totals, date: new Date().toISOString() });
                    router.push("/dashboard");
                } catch (e) { alert("Eroare la salvare"); }
                finally { setLoading(false); }
            }}
            disabled={loading || !mealTitle || ingredients.length === 0}
            className="w-full py-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : "SALVEAZĂ MASA"}
          </Button>
        </div>
      </div>
    </div>
  );
}