"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Package, Loader2, Trash2, Edit2, X, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

// 1. Definim clar ce este un Produs pentru a scăpa de eroarea 'never'
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  address?: string;
  phone?: string;
}

export default function FarmerDashboard() {
  // Fix eroarea 'never': precizăm că starea este un tablou de Product
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/marketplace/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProducts(); }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("GPS-ul nu este suportat.");
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        setValue("address", res.data.display_name);
      } catch (e) {
        alert("Eroare la preluarea adresei.");
      }
    });
  };

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { 
        ...data, 
        price: parseFloat(data.price), 
        quantity: parseInt(data.quantity) 
      };

      if (editingProduct) {
        await axios.patch(`http://localhost:3000/marketplace/${editingProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3000/marketplace", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      reset();
      fetchMyProducts();
    } catch (err) {
      alert("Eroare la salvare.");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic uppercase text-slate-900">
          My <span className="text-emerald-500">Farm</span>
        </h1>
        <Button 
          onClick={() => { setEditingProduct(null); setShowModal(true); reset(); }} 
          className="bg-emerald-600 rounded-2xl h-12 px-6 font-bold text-white shadow-lg"
        >
          <Plus className="mr-2" size={20}/> ADĂUGĂ PRODUS
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-xl bg-white p-6">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
        ) : (
          <div className="grid gap-4">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem]">
                <div>
                  <p className="font-black text-slate-800 text-lg">{p.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">{p.category} • {p.price} RON</p>
                </div>
                <div className="flex gap-2">
                  {/* Fix eroarea 'ghost': folosim 'outline' pentru că butonul tău nu acceptă 'ghost' */}
                  <Button 
                    variant="outline" 
                    onClick={() => { 
                      setEditingProduct(p); 
                      setValue("name", p.name); 
                      setValue("price", p.price); 
                      setValue("quantity", p.quantity); 
                      setValue("category", p.category); 
                      setShowModal(true); 
                    }}
                  >
                    <Edit2 size={18}/>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-100 hover:bg-red-50" 
                    onClick={async () => { 
                      if(confirm("Ștergi?")) { 
                        await axios.delete(`http://localhost:3000/marketplace/${p.id}`, { 
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        }); 
                        fetchMyProducts(); 
                      }
                    }}
                  >
                    <Trash2 size={18}/>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white p-8 rounded-[2.5rem] relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X />
            </button>
            <h2 className="text-xl font-black uppercase mb-6 italic text-slate-800">Detalii Produs & Contact</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register("name")} placeholder="Nume Produs" required />
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("price")} type="number" step="0.01" placeholder="Preț RON" required />
                <Input {...register("quantity")} type="number" placeholder="Stoc" required />
              </div>
              <Input {...register("category")} placeholder="Categorie (Legume, Fructe, etc.)" required />
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Locație Fermă</label>
                  <button 
                    type="button" 
                    onClick={detectLocation} 
                    className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                  >
                    <MapPin size={10} /> DETECTEAZĂ GPS
                  </button>
                </div>
                <Input {...register("address")} placeholder="Adresa completă (se poate completa prin GPS)" required />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Telefon Contact</label>
                <Input {...register("phone")} placeholder="07xx xxx xxx" required />
              </div>

              <Button type="submit" className="w-full h-12 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-700 transition-all mt-4">
                {editingProduct ? "ACTUALIZEAZĂ PRODUSUL" : "SALVEAZĂ PRODUSUL"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}