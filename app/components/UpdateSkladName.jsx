"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

export function UpdateSkladName({ buildingId, path, sklad, skladName }) {
  const [newSkladName, setNewSkladName] = useState(skladName);

  const editSkladName = async () => {
    try {
      const skladDocRef = doc(db, "buildings", buildingId, path, sklad.id);
      await updateDoc(skladDocRef, { name: newSkladName });
      toast.success(
        path === "sklads"
          ? "Sklad nomi muvaffaqiyatli yangilandi:"
          : "Xona nomi muvaffaqiyatli yangilandi:",
        newSkladName
      );
    } catch (error) {
      toast.error(
        path === "sklads"
          ? "Skladni tahrirlashda xatolik:"
          : "Xonani tahrirlashda xatolik:",
        error.message
      );
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tahrirlash</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {path === "sklads" ? "Sklad " : "Xona "} nomi
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={newSkladName}
              onChange={(e) => setNewSkladName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Bekor qilish</DialogClose>
          <DialogClose onClick={editSkladName}>Tahrirlash</DialogClose>
          {/* <Button onClick={editSkladName}>Qo'shish</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
