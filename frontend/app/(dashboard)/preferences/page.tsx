"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useState, useEffect } from "react";

export default function PreferencesPage() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  // Încărcăm preferințele salvate anterior
  useEffect(() => {
    api.get("/preferences/me")
      .then(res => reset(res.data))
      .catch(err => console.log("Nu există preferințe salvate încă."));
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      // Chemăm ruta ta: updateMyPreferences (@Post('me'))
      await api.post("/preferences/me", {
        allergies: data.allergies,
        dislikes: data.dislikes,
        conditions: data.conditions
      });
      setMessage("✅ Preferințele au fost salvate cu succes!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Eroare la salvare.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="border-t-4 border-t-green-600">
        <CardHeader>
          <CardTitle className="text-2xl">Restricții și Preferințe</CardTitle>
          <p className="text-sm text-gray-500">
            Aceste informații vor fi folosite pentru a filtra rețetele recomandate.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Alergii (ex: nuci, gluten, lactoză)</label>
              <Input 
                {...register("allergies")} 
                placeholder="Separă-le prin virgulă..." 
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Alimente pe care nu le suporti (Dislikes)</label>
              <Input 
                {...register("dislikes")} 
                placeholder="Ex: ceapă, mărar, ciuperci..." 
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Condiții Medicale / Dietă specifică</label>
              <Input 
                {...register("conditions")} 
                placeholder="Ex: Diabet, Hipertensiune, Vegetarian..." 
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Actualizează Preferințe
            </Button>

            {message && (
              <p className={`text-center p-2 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}