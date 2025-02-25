import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo es inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Requerido"),
  email: z.string().email("Correo es inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
