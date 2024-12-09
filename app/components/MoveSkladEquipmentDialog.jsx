"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, collection, getDocs, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { DoorOpen } from "lucide-react";

export const MoveSkladEquipmentDialog = ({ buildingId, skladId, equipment }) => {
  const [open, setOpen] = useState(false);
  const [sklads, setSklads] = useState([]); // Mavjud skladdan tanlash
  const [selectedSklad, setSelectedSklad] = useState(""); // Tanlangan sklad

  useEffect(() => {
    // Mavjud skladdan tanlash uchun malumot olish
    const fetchSklads = async () => {
      const skladsCollection = collection(doc(db, "buildings", buildingId), "sklads");
      const skladsSnapshot = await getDocs(skladsCollection);
      const skladsList = skladsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setSklads(skladsList);
    };

    fetchSklads();
  }, [buildingId]);

  const handleMoveEquipment = async () => {
    if (!selectedSklad) return toast.error("Skladni tanlang!");
  
    try {
      const sourceRef = doc(
        db,
        "buildings",
        buildingId,
        "sklads",
        skladId,
        "equipment",
        equipment.id
      );
      const destinationRef = doc(
        db,
        "buildings",
        buildingId,
        "sklads",
        selectedSklad,
        "equipment",
        equipment.id
      );
  
      // Manbadan ma'lumotni olish
      const equipmentData = { ...equipment };
      delete equipmentData.id; // ID-ni qaytadan saqlamaslik uchun olib tashlash
  
      // Yangi joyga ma'lumot yozish (agar mavjud bo'lmasa, yaratadi)
      await setDoc(destinationRef, equipmentData);
  
      // Eski joydan o‘chirish
      await deleteDoc(sourceRef);
  
      toast.success("Jihoz muvaffaqiyatli ko‘chirildi!");
      setOpen(false);
    } catch (error) {
      console.error("Jihozni ko'chirishda xato:", error);
      toast.error("Jihozni ko'chirishda xatolik yuz berdi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><DoorOpen size="250px" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Jihozni boshqa skladga ko‘chirish</DialogTitle>
        <div className="my-4">
          <Select onValueChange={setSelectedSklad}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skladni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {sklads.map((sklad) => (
                <SelectItem key={sklad.id} value={sklad.id}>
                  {sklad.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleMoveEquipment}>Ko‘chirish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
