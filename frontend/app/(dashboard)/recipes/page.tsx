"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, ChefHat, Flame, X, Heart } from "lucide-react"; // Am adăugat Heart

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State pentru Modal
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // 1. Fetch inițial pentru lista de rețete
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/recipes/for-me");
      setRecipes(res.data);
    } catch (err) {
      console.error("Eroare la listă", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch pentru detaliile unei singure rețete (când apeși butonul)
  const handleViewRecipe = async (id: number) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/recipes/${id}`);
      setSelectedRecipe(res.data);
      setIsModalOpen(true);
    } catch (err) {
      alert("Nu am putut încărca detaliile rețetei.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSaveFavorite = async (recipe: any) => {
    try {
      // Trimitem datele către metoda saveFavorite din RecipesService
      await api.post("/recipes/favorite", {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image
      });
      alert("Rețetă salvată la favorite! ❤️");
    } catch (err) {
      console.error("Eroare la salvare", err);
      alert("A apărut o problemă la salvare.");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-2">Rețete pentru tine</h1>
      <p className="text-gray-500 mb-8">Bazate pe ce ai în frigider și preferințele tale alimentare.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe: any) => (
          <Card key={recipe.id} className="overflow-hidden relative group"> {/* Adăugat relative pentru buton */}
            
            {/* --- BUTON FAVORITE PE CARD --- */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSaveFavorite(recipe);
              }}
              className="absolute top-2 right-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-red-500 shadow-sm transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>

            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleViewRecipe(recipe.id)} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loadingDetails}
              >
                {loadingDetails ? "Se încarcă..." : "Vezi Rețeta"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- MODALUL PENTRU DETALII --- */}
      {isModalOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <img src={selectedRecipe.image} className="w-full h-72 object-cover" />
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                
                {/* --- BUTON FAVORITE ÎN MODAL --- */}
                <Button 
                  variant="outline" 
                  onClick={() => handleSaveFavorite(selectedRecipe)}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" /> Favorite
                </Button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  <Flame className="w-4 h-4" /> {selectedRecipe.nutrition?.nutrients[0]?.amount} kcal
                </span>
                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  <ChefHat className="w-4 h-4" /> {selectedRecipe.readyInMinutes} min
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 border-b pb-2">Ingrediente</h3>
                  <ul className="space-y-2 text-gray-600">
                    {selectedRecipe.extendedIngredients?.map((ing: any) => (
                      <li key={ing.id}>• {ing.original}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 border-b pb-2">Mod de preparare</h3>
                  <div 
                    className="text-gray-700 leading-relaxed prose-sm"
                    dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions || "Nu există instrucțiuni disponibile." }} 
                  />
                </div>
              </div>
              
              <Button onClick={() => setIsModalOpen(false)} className="w-full mt-8 bg-gray-800">
                Închide
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}