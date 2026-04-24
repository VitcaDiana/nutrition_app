"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Navigație Simplă */}
      <nav className="flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-bold text-green-600">NutriApp</h1>
   <div className="space-x-4 flex items-center">
  <Link href="/login">
    <Button variant="primary" className="bg-green-600 text-white hover:bg-green-700">
      Autentificare
    </Button>
  </Link>
  
  <Link href="/register">
    <Button variant="primary" className="bg-green-600 text-white hover:bg-green-700">
      Creare Cont
    </Button>
  </Link>
</div>
      </nav>

      
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Mănâncă sănătos, <span className="text-green-500">trăiește mai bine</span>.
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Planuri alimentare personalizate, produse direct de la fermieri și 
          consultanță de la nutriționiști de top. Toate într-o singură aplicație.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8 text-lg">Creează Cont</Button>
          </Link>
        </div>

        {/* 3. Secțiune cu "Poze" (Placeholders profesioniști) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop" 
              alt="Mâncare sănătoasă"
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">Rețete Personalizate</h3>
              <p className="text-sm text-gray-500">Găsește rețete care se potrivesc stilului tău de viață.</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=250&fit=crop" 
              alt="Fermieri locali"
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">Produse Locale</h3>
              <p className="text-sm text-gray-500">Cumpără direct de la fermieri verificați.</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop" 
              alt="Exerciții"
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">Sfaturi Experte</h3>
              <p className="text-sm text-gray-500">Discută direct cu nutriționiști calificați.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}