"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Loader2, Search, MapPin, Phone, 
  ExternalLink, Leaf, Milk, Egg, Apple 
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  farmer: {
    name: string;
    address: string;
    phone: string;
  };
}

const CATEGORIES = [
  { name: "Toate", icon: null },
  { name: "Legume", icon: <Leaf size={14} /> },
  { name: "Lactate", icon: <Milk size={14} /> },
  { name: "Ouă", icon: <Egg size={14} /> },
  { name: "Fructe", icon: <Apple size={14} /> },
];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toate");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/marketplace", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Eroare la încărcare");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Toate" || p.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
          Local <span className="text-emerald-500">Market</span>
        </h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <Input 
            placeholder="Caută produse proaspete..." 
            className="pl-12 h-14 rounded-2xl border-none shadow-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categorii */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-sm
              ${activeCategory === cat.name ? "bg-emerald-600 text-white" : "bg-white text-slate-400 hover:bg-slate-100"}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Produse */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase italic leading-none">{product.farmer?.name}</p>
                </div>
                <p className="text-2xl font-black text-slate-900 leading-none">{product.price} <span className="text-xs">RON</span></p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-2xl">
                <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-[11px] font-bold text-slate-600 leading-tight italic">
                  {product.farmer?.address || "Locație nespecificată"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {/* BUTON HARTĂ */}
                <Button 
                  variant="outline"
                  className="rounded-xl border-slate-200 font-black text-[10px] h-12 uppercase flex gap-2"
                  onClick={() => {
                    if (product.farmer?.address) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(product.farmer.address)}`, '_blank');
                    } else {
                      alert("Fermierul nu are adresă setată.");
                    }
                  }}
                >
                  <ExternalLink size={14} /> Hartă
                </Button>

                {/* BUTON TELEFON */}
                <a href={product.farmer?.phone ? `tel:${product.farmer.phone.replace(/\s+/g, '')}` : "#"} className="w-full">
                  <Button 
                    disabled={!product.farmer?.phone}
                    className="w-full bg-slate-900 text-white rounded-xl font-black text-[10px] h-12 uppercase flex gap-2 hover:bg-emerald-600"
                  >
                    <Phone size={14} /> Sună
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}