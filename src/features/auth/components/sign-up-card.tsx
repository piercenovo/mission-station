"use client";

import Link from "next/link";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "../schema";
import { useRegister } from "../api/use-register";

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Regístrate</CardTitle>
        <CardDescription>
          Al registrarte, aceptas nuestra{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Política de Privacidad</span>
          </Link>{" "}
          y{" "}
          <Link href="/terms">
            <span className="text-blue-700">Condiciones de servicio</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Ingresa tu nombre"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Ingresa tu correo electrónico"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Ingresa tu contraseña"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size="lg" className="w-full">
              Regístrate
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          variant="secondary"
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-1 size-6" />
          Regístrate con Google
        </Button>
        <Button
          variant="secondary"
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-1 size-6" />
          Regístrate con Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          ¿Ya tienes una cuenta?
          <Link href="sign-in">
            <span className="text-blue-700">&nbsp;Inicia sesión</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
