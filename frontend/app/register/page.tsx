"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Importăm piesele de UI din components/ui
import { Button } from "@/components/ui/Button"; 
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  // Configurăm formularul
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" }
  });

  // Funcția principală (înlocuiește handleRegister)
  const onSubmit = async (data: RegisterInput) => {
    try {
      setServerError("");
      
      // Pas 1: Register
      await api.post("/users/register", data);
      
      // Pas 2: Login automat (așa cum aveai tu în cod)
      const loginRes = await api.post("/users/login", {
        email: data.email,
        password: data.password
      });

      // Salvăm token-ul
      localStorage.setItem("token", loginRes.data.access_token);

      // Redirecționăm
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Eroare la înregistrare");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {/* handleSubmit colectează automat datele și le validează cu Zod înainte de onSubmit */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1">
              <Input placeholder="Name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <select
                {...register("role")}
                className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">USER</option>
                <option value="FARMER">FARMER</option>
                <option value="NUTRITIONIST">NUTRITIONIST</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>

            {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Se procesează..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}