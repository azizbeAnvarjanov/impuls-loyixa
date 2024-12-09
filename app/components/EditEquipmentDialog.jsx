"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/app/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FilePen } from "lucide-react";
import { toast } from "react-hot-toast";

export const EditEquipmentDialog = ({ buildingId, skladId, equipment }) => {
  const [open, setOpen] = useState(false);
  const [inventoryNumber, setInventoryNumber] = useState(equipment.inventoryNumber);
  const [name, setName] = useState(equipment.name);
  const [type, setType] = useState(equipment.type);
  const [quantity, setQuantity] = useState(equipment?.quantity);
  const [pricePerItem, setPricePerItem] = useState(equipment?.pricePerItem);

  const handleEdit = async () => {
    if (!name || !type || !quantity || !pricePerItem) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const totalPrice = quantity * pricePerItem;

    try {
      const ref = doc(db, "buildings", buildingId, "sklads", skladId, "equipment", equipment.id);
      await updateDoc(ref, {
        inventoryNumber,
        name,
        type,
        quantity: parseInt(quantity),
        pricePerItem: parseFloat(pricePerItem),
        totalPrice,
      });

      toast.success("Jihoz muvaffaqiyatli tahrirlandi!");
      setOpen(false);
    } catch (error) {
      toast.error("Jihozni tahrirlashda xatolik:", error.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}><FilePen size={20} /></Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihozni Tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Invertor raqami"
              value={inventoryNumber}
              onChange={(e) => setInventoryNumber(e.target.value)}
            />
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
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
