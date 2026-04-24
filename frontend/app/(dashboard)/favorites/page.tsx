"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Trash2, Utensils, Info, HeartOff } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/recipes/favorites");
      setFavorites(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const removeFavorite = async (id: number) => {
    if (!confirm("Ștergi această rețetă?")) return;
    try {
      await api.delete(`/recipes/favorite/${id}`);
      setFavorites(f => f.filter((i: any) => i.id !== id));
    } catch (err) { alert("Eroare la ștergere."); }
  };

  // REPARAT: Trimitem manual datele dacă lipsesc din obiectul Favorite
  const handleAddToMeal = async (recipe: any) => {
    try {
      await api.post("/mealplan", {
        title: recipe.title,
        recipeId: Number(recipe.recipeId),
        // Dacă în baza de date favorite nu ai calorii, aici se pot pune valori din API sau 0
        calories: Number(recipe.calories) || 500, // Exemplu fallback
        protein: Number(recipe.protein) || 25,
        carbs: Number(recipe.carbs) || 40,
        fat: Number(recipe.fat) || 15,
        mealType: "lunch",
        date: new Date().toISOString()
      });
      alert("Adăugat la masa de azi!");
    } catch (err) { alert("Eroare la salvare."); }
  };

  useEffect(() => { fetchFavorites(); }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-black">Rețete Favorite</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <HeartOff className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Nu ai nicio rețetă salvată.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {favorites.map((recipe: any) => (
            <Card key={recipe.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-3xl">
              <img src={recipe.image} alt={recipe.title} className="h-48 w-full object-cover" />
              <CardHeader><CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button onClick={() => handleAddToMeal(recipe)} variant="primary" className="flex-1 bg-emerald-600 text-white rounded-xl">
                    <Utensils size={16} className="mr-2" /> Adaugă la masa de azi
                  </Button>
                  <Button onClick={() => removeFavorite(recipe.id)} variant="outline" className="text-red-500 border-red-100 rounded-xl">
                    <Trash2 size={18} />
                  </Button>
                </div>
                <Button 
                  onClick={() => window.location.href = `/dashboard/recipes/${recipe.recipeId}`} 
                  variant="secondary" 
                  className="w-full bg-gray-100 rounded-xl"
                >
                  <Info size={16} className="mr-2" /> Detalii Rețetă
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}