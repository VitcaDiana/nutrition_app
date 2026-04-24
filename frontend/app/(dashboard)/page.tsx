"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DashboardPage() {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    api.get("/nutrition/progress").then(res => setProgress(res.data)).catch(() => {});
  }, []);

  if (!progress) return <p className="p-6">Configurează-ți profilul pentru a vedea progresul...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-green-600 text-white">
        <CardHeader><CardTitle className="text-sm">Target Zilnic</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold">{progress.target} kcal</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Consumat</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold text-orange-500">{progress.consumed} kcal</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Rămas</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold text-green-600">{progress.remaining} kcal</p></CardContent>
      </Card>
    </div>
  );
}