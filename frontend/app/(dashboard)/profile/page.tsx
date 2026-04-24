"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Încărcăm datele existente la început
  useEffect(() => {
    api.get("/nutrition/targets").then(res => reset(res.data)).catch(() => {});
  }, [reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Trimitem datele către setProfile din controllerul tău
      await api.post("/nutrition/profile", {
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        age: parseInt(data.age),
        gender: data.gender,
        activityLevel: data.activityLevel,
        goal: data.goal
      });
      alert("Profil actualizat!");
    } catch (err) {
      alert("Eroare la salvare");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader><CardTitle>Date Biometrice</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input {...register("weight")} type="number" placeholder="Greutate (kg)" />
              <Input {...register("height")} type="number" placeholder="Înălțime (cm)" />
              <Input {...register("age")} type="number" placeholder="Vârstă" />
              <select {...register("gender")} className="border rounded-md p-2">
                <option value="male">Masculin</option>
                <option value="female">Feminin</option>
              </select>
            </div>
            <select {...register("activityLevel")} className="w-full border rounded-md p-2">
              <option value="low">Sedentar (Low)</option>
              <option value="medium">Activ (Medium)</option>
              <option value="high">Foarte Activ (High)</option>
            </select>
            <select {...register("goal")} className="w-full border rounded-md p-2 font-bold text-green-700">
              <option value="cut">Slăbire (Cut)</option>
              <option value="maintain">Menținere</option>
              <option value="bulk">Masă Musculară (Bulk)</option>
            </select>
            <Button type="submit" className="w-full" disabled={loading}>Salvează Profilul</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}