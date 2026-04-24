import z from "zod";


export const loginSchema = z.object({
    email: z.string().email("Adresa de email nu este valida"),
    password: z.string().min(6,"Parola trebuie sa aiba cel putin 6 caractere"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Numele este prea scurt"),
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "Minim 6 caractere"),
  role: z.enum(["USER", "FARMER", "NUTRITIONIST"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;