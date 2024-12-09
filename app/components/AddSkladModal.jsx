"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDoc, collection } from "firebase/firestore";
import { CircleFadingPlus, Plus } from "lucide-react";
import { db } from "../firebase";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function AddSkladModal({ buildingId, path }) {
  const [skladName, setSkladName] = useState("");

  const addSklad = async (buildingId) => {
    try {
      const skladsRef = collection(db, "buildings", buildingId, path);
      const newSklad = {
        name: skladName,
        createdAt: new Date(),
      };
      const skladDocRef = await addDoc(skladsRef, newSklad);
      toast.success(
        path === "sklads" ? "Yangi sklad qo'shildi:" : "Yangi xona qo'shildi:",
        skladDocRef.id
      );
    } catch (error) {
      toast.error(
        path === "sklads"
          ? "Sklad qo'shishda xatolik !:"
          : "Xona qo'shishda xatolik !",
        error.message
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
        <CircleFadingPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Yangi {path === "rooms" ? "xona " : "sklad "}qo'shish
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {path === "rooms" ? "Xona " : "Sklad "} nomi
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={skladName}
              onChange={(e) => setSkladName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => addSklad(buildingId)}>Qo'shdish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
