"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import Link from "next/link";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Muvaffaqiyatli kirishdan so'ng Dashboard sahifasiga o'tadi
    } catch (err) {
      setError("Login yoki parol xato");
    }
  };
  return (
    <div className="h-[100vh] w-full grid place-items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Tizimga kirish</CardTitle>
          <CardDescription>
            Tizimga kirish uchun email pochtangizni va parolingizni kiriting !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Kirish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
