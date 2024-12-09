"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { db } from "@/app/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { DoorOpen } from "lucide-react";

export const MoveEquipmentDialog = ({ buildingId, skladId, equipment, sklads, rooms }) => {
  const [open, setOpen] = useState(false);
  const [moveType, setMoveType] = useState(""); // "sklad" yoki "room"
  const [targetId, setTargetId] = useState("");
  const [moveQuantity, setMoveQuantity] = useState(1);

  const handleMove = async () => {
    if (!targetId || moveQuantity < 1 || moveQuantity > equipment?.quantity) {
      toast.error("Ma'lumotlarni to'g'ri kiriting!");
      return;
    }

    try {
      const sourceRef = doc(db, "buildings", buildingId, "sklads", skladId, "equipment", equipment.id);

      if (moveType === "sklad") {
        const targetRef = collection(db, "buildings", buildingId, "sklads", targetId, "equipment");

        await addDoc(targetRef, {
          ...equipment,
          quantity: moveQuantity,
          totalPrice: equipment.pricePerItem * moveQuantity,
        });
      } else if (moveType === "room") {
        const targetRef = collection(db, "buildings", buildingId, "rooms", targetId, "equipment");

        await addDoc(targetRef, {
          ...equipment,
          quantity: moveQuantity,
          totalPrice: equipment.pricePerItem * moveQuantity,
        });
      }

      await updateDoc(sourceRef, {
        quantity: equipment.quantity - moveQuantity,
        totalPrice: equipment.pricePerItem * (equipment.quantity - moveQuantity),
      });

      toast.success("Jihoz muvaffaqiyatli ko'chirildi!");
      setOpen(false);
    } catch (error) {
      console.error("Jihoz ko'chirishda xatolik:", error.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}><DoorOpen /></Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihozni Ko'chirish</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Select onValueChange={setMoveType}>
              <SelectTrigger>Ko'chirish turi tanlang</SelectTrigger>
              <SelectContent>
                <SelectItem value="sklad">Skladga Ko'chirish</SelectItem>
                <SelectItem value="room">Xonaga Ko'chirish</SelectItem>
              </SelectContent>
            </Select>
            {moveType && (
              <Select onValueChange={setTargetId}>
                <SelectTrigger>
                  {moveType === "sklad" ? "Skladni tanlang" : "Xonani tanlang"}
                </SelectTrigger>
                <SelectContent>
                  {(moveType === "sklad" ? sklads : rooms)?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Input
              placeholder="Ko'chiriladigan soni"
              type="number"
              value={moveQuantity}
              onChange={(e) => setMoveQuantity(parseInt(e.target.value))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleMove}>Ko'chirish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
