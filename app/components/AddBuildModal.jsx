"use client";
import { Button } from "@/components/ui/button";
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
import { CircleFadingPlus, Plus } from "lucide-react";
import { useState } from "react";

import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { toast } from "react-hot-toast";

export function AddBuildModal({}) {
  const [buildingName, setBuildingName] = useState("");

  const addBuild = async (e) => {
    e.preventDefault();

    try {
      // Unikal `buldingId` yaratish
      const buildingId = buildingName.replaceAll(" ", "-").toLowerCase();

      // Asosiy bino ma'lumotlarini tayyorlash
      const buildingData = {
        id: buildingId,
        name: buildingName,
      };

      // Binoni Firestore'ga qo'shish
      const buildingRef = doc(db, "buildings", buildingId);
      await setDoc(buildingRef, buildingData);

      // Binoning `rooms` kolleksiyasiga default xona qo'shish
      const roomsRef = collection(buildingRef, "rooms");
      await addDoc(roomsRef, {
        name: "Default Room",
        items: [],
      });

      // Binoning `sklads` kolleksiyasiga default sklad qo'shish
      const skladsRef = collection(buildingRef, "sklads");
      await addDoc(skladsRef, {
        name: "Default Sklad",
        items: [],
      });

      // alert("Bino muvaffaqiyatli qo'shildi!");
      toast.success("Bino muvaffaqiyatli qo'shildi!");
      setBuildingName(""); // Inputni tozalash
    } catch (error) {
      toast.success(`Xatolik yuz berdi: ${error.message}`);

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
          <DialogTitle>Yangi bino qo'shish</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Bino nomi
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="bg-black text-white py-2 px-4 rounded" onClick={addBuild}>Qo'shish</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
