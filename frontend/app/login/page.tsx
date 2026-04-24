"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validation/auth"; // Schema Zod pentru login
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
  try {
    const res = await api.post("/users/login", data);
    
    // 1. Salvezi token-ul
    localStorage.setItem("token", res.data.access_token);
    
    // 2. IMPORTANT: Refresh-ul forțează AuthContext să citească noul token
    window.location.href = "/dashboard"; 
    // Folosim window.location.href în loc de router.push pentru a fi siguri 
    // că tot statul aplicației se resetează cu noul user
  } catch (err) {
    console.error("Eroare login:", err);
  }
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Autentificare</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input {...register("email")} type="email" placeholder="nume@exemplu.com" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Parolă</label>
              <Input {...register("password")} type="password" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Se încarcă..." : "Intră în cont"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}