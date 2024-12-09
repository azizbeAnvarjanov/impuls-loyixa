"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CircleFadingPlus } from "lucide-react";
import { toast } from "react-hot-toast";

export const AddEquipmentDialog = ({ buildingId, skladId }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pricePerItem, setPricePerItem] = useState("");
  const [inventoryNumber, setInventoryNumber] = useState(""); // Yangi maydon

  const handleAdd = async () => {
    if (!name || !type || !quantity || !pricePerItem) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const totalPrice = quantity * pricePerItem;

    try {
      const ref = collection(db, "buildings", buildingId, "sklads", skladId, "equipment");
      await addDoc(ref, {
        name,
        type,
        quantity,
        pricePerItem: parseFloat(pricePerItem),
        totalPrice,
        inventoryNumber: inventoryNumber || 0, // Agar foydalanuvchi to'ldirmasa, null saqlanadi
        createdAt: serverTimestamp(),
      });

      toast.success("Jihoz muvaffaqiyatli qo'shildi!");
      setOpen(false);
      setName("");
      setType("");
      setQuantity(1);
      setPricePerItem("");
      setInventoryNumber(""); // Formani tozalash
    } catch (error) {
      console.error("Jihoz qo'shishda xatolik:", error.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}><CircleFadingPlus /></Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihoz qo'shish</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Jihoz nomi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Jihoz turi"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <Input
              placeholder="Soni"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <Input
              placeholder="1 dona narxi"
              type="number"
              value={pricePerItem}
              onChange={(e) => setPricePerItem(parseFloat(e.target.value))}
            />
            <Input
              placeholder="Inventar raqami (majburiy emas)" // Yangi maydon
              value={inventoryNumber}
              onChange={(e) => setInventoryNumber(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAdd}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
