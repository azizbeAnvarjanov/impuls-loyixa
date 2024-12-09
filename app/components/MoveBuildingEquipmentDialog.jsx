"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { toast } from "react-hot-toast";

export const MoveBuildingEquipmentDialog = ({ currentBuildingId, equipment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);

  // Binolar ro'yxatini olish
  useEffect(() => {
    const fetchBuildings = async () => {
      const buildingsRef = collection(doc(db, "buildings", currentBuildingId), "rooms");
      const buildingsSnapshot = await getDocs(buildingsRef);
      const buildingsList = buildingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setBuildings(buildingsList);
    };

    fetchBuildings();
  }, []);

  const handleMoveEquipment = async () => {
    if (!selectedBuilding) {
      toast.error("Iltimos, bino tanlang!");
      return;
    }

    try {
      // Jihozni yangi binoga ko'chirish
      const currentEquipmentRef = doc(
        db,
        "buildings",
        currentBuildingId,
        "equipment",
        equipment.id
      );
      const newEquipmentRef = doc(
        db,
        "buildings",
        selectedBuilding,
        "equipment",
        equipment.id
      );

      // Yangi hujjatga ma'lumotni ko'chirish
      await updateDoc(newEquipmentRef, { ...equipment });

      // Eski hujjatni o'chirish
      await updateDoc(currentEquipmentRef, null);

      toast.success("Jihoz muvaffaqiyatli ko'chirildi!");
      setIsOpen(false);
    } catch (error) {
      console.error("Jihozni ko'chirishda xatolik:", error);
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Binoga ko‘chirish
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihozni binoga ko‘chirish</DialogTitle>
          </DialogHeader>

          {/* Bino tanlash select */}
          <div className="my-4">
            <Select onValueChange={setSelectedBuilding}>
              <SelectTrigger>
                <SelectValue placeholder="Bino tanlang" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleMoveEquipment}>Ko‘chirish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
