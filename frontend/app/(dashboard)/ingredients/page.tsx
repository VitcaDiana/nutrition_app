"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2, Trash2, AlertCircle, Calendar, Plus, Minus } from "lucide-react";

// Lista de unități disponibile
const UNIT_OPTIONS = ["buc", "kg", "g", "l", "ml", "pachet"];

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  status: string;
  expiresAt: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ 
    name: "", 
    quantity: "", 
    unit: "buc", // Unitate implicită
    category: "altele",
    expiresAt: "" 
  });

  const fetchIngredients = async () => {
    try {
      const res = await api.get("/ingredients/status");
      setIngredients(res.data);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, currentAmount: number, delta: number) => {
    const newAmount = Math.max(0, currentAmount + delta);
    setIngredients(prev => prev.map((ing) => ing.id === id ? { ...ing, quantity: newAmount } : ing));
    try {
      await api.patch(`/ingredients/${id}/quantity`, { amount: newAmount });
    } catch (err) {
      fetchIngredients();
    }
  };

  // Funcție nouă pentru schimbarea unității la un ingredient existent
  const updateUnit = async (id: number, newUnit: string) => {
    setIngredients(prev => prev.map((ing) => ing.id === id ? { ...ing, unit: newUnit } : ing));
    try {
      await api.patch(`/ingredients/${id}`, { unit: newUnit });
    } catch (err) {
      fetchIngredients();
    }
  };

  const addIngredient = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.expiresAt) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }
    try {
      await api.post("/ingredients", {
        ...newItem,
        quantity: parseFloat(newItem.quantity),
        expiresAt: new Date(newItem.expiresAt).toISOString()
      });
      setNewItem({ name: "", quantity: "", unit: "buc", category: "altele", expiresAt: "" });
      fetchIngredients(); 
    } catch (err) {
      alert("Eroare la adăugare");
    }
  };

  const deleteIngredient = async (id: number) => {
    if (!confirm("Sigur vrei să ștergi?")) return;
    try {
      await api.delete(`/ingredients/${id}`);
      fetchIngredients();
    } catch (err) {
      alert("Eroare la ștergere");
    }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "EXPIRED": return "border-red-500 bg-red-50 text-red-700";
      case "EXPIRING": return "border-amber-500 bg-amber-50 text-amber-700";
      default: return "border-green-200 bg-white text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Stoc Ingrediente</h1>
      
      {/* Formular Adăugare cu Select pentru Unități */}
      <Card className="mb-10 shadow-sm border-none bg-slate-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input 
                placeholder="Nume ingredient" 
                value={newItem.name} 
                onChange={e => setNewItem({...newItem, name: e.target.value})} 
              />
            </div>
            <Input 
              type="number" 
              placeholder="Cantitate" 
              value={newItem.quantity} 
              onChange={e => setNewItem({...newItem, quantity: e.target.value})} 
            />
            {/* Select Unitate pentru adăugare */}
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newItem.unit}
              onChange={e => setNewItem({...newItem, unit: e.target.value})}
            >
              {UNIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <Input 
              type="date" 
              value={newItem.expiresAt} 
              onChange={e => setNewItem({...newItem, expiresAt: e.target.value})} 
            />
            <Button onClick={addIngredient} className="bg-green-600 hover:bg-green-700 text-white">
              Adaugă
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-green-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((item) => (
            <div key={item.id} className={`p-5 border-l-4 rounded-r-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${getStatusStyle(item.status)}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg capitalize">{item.name}</h3>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Control Cantitate */}
                    <div className="flex items-center gap-2 bg-black/5 rounded-lg p-1 w-fit">
                      <button onClick={() => updateQuantity(item.id, item.quantity, -0.5)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus size={14} /></button>
                      <span className="text-sm font-bold min-w-[30px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity, 0.5)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Plus size={14} /></button>
                    </div>

                    {/* Select Unitate pentru modificare rapidă */}
                    <select 
                      className="text-xs font-semibold bg-transparent border-b border-dashed border-gray-400 focus:outline-none w-fit cursor-pointer"
                      value={item.unit}
                      onChange={(e) => updateUnit(item.id, e.target.value)}
                    >
                      {UNIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={() => deleteIngredient(item.id)} className="p-2 hover:bg-red-100 rounded-full text-red-500"><Trash2 size={18} /></button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold mt-4">
                <Calendar size={14} />
                <span>Expiră: {new Date(item.expiresAt).toLocaleDateString('ro-RO')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}