"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/app/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export const DeleteEquipmentModal = ({ buildingId, skladId, equipmentId }) => {
  const handleDelete = async () => {
    const ref = doc(
      db,
      "buildings",
      buildingId,
      "sklads",
      skladId,
      "equipment",
      equipmentId
    );
    try {
      await deleteDoc(ref);
      toast.success("Jihoz muvaffaqiyatli o'chirildi!");
    } catch (error) {
      toast.error("Jihoz o'chirishda xatolik:", error.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rostan ham o'chirmoqchimiz !</AlertDialogTitle>
          <AlertDialogDescription>
            Agar binoni o'chirsangiz ichidagi barcha jihozlar ham o'chib ketadi
            tiklab bo'lmaydi !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            O'chirish
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
