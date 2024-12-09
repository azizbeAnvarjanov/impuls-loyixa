"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditEquipmentDialog } from "@/app/components/EditEquipmentDialog";
import { DeleteBuildingModal } from "@/app/components/DeleteBuildingModal";
import { MoveEquipmentDialog } from "@/app/components/MoveEquipmentDialog";
import { AddEquipmentDialog } from "@/app/components/AddEquipmentDialog";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
import { DeleteEquipmentModal } from "@/app/components/DeleteEquipmentModal";
import { MoveSkladEquipmentDialog } from "@/app/components/MoveSkladEquipmentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EquipmentTable = () => {
  const params = useParams();
  const skladId = params?.skladId; // Sklad ID'si
  const buildingId = params?.binoId; // Bino ID'si

  const [equipment, setEquipment] = useState([]);
  const [nameFilter, setNameFilter] = useState(""); // Jihoz nomi bo'yicha filtr
  const [inventoryNumberFilter, setInventoryNumberFilter] = useState(""); // Invertor raqami bo'yicha filtr
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState(""); // Jihoz turi bo'yicha filtr

  const [skladName, setSkladName] = useState(""); // Sklad nomi

  // Sklad nomini olish
  useEffect(() => {
    const skladDoc = doc(db, "buildings", buildingId, "sklads", skladId);
    getDoc(skladDoc).then((docSnap) => {
      if (docSnap.exists()) {
        setSkladName(docSnap.data().name || ""); // Sklad nomi
      }
    });
  }, [buildingId, skladId]);

  useEffect(() => {
    const equipmentRef = collection(
      doc(db, "buildings", buildingId),
      "sklads",
      skladId,
      "equipment"
    );

    const unsubscribe = onSnapshot(equipmentRef, (snapshot) => {
      const equipmentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipment(equipmentList);
    });

    return () => unsubscribe();
  }, [buildingId, skladId]);

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      item?.inventoryNumber
        ?.toLowerCase()
        .includes(inventoryNumberFilter.toLowerCase()) && // Invertor raqami bo'yicha filtr
      (equipmentTypeFilter ? item.type === equipmentTypeFilter : true)
  );

  // Umumiy summani hisoblash (USD'dan so'mga o'zgartirish)
  const totalSumInSom = filteredEquipment.reduce(
    (total, item) => total + item.totalPrice, // 1 USD = 12,000 UZS (so'mda)
    0
  );

  function formatCurrency(amount) {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
    }).format(amount);
  }

  return (
    <div className="p-5 bg-slate-100">
      <h1 className="text-2xl mb-4">
        <strong>{skladName}</strong>
      </h1>

      {/* Filter va qidiruv */}
      <div className="flex gap-4 mb-4">
        <Input
          className="bg-white"
          placeholder="Jihoz nomi bo'yicha qidirish..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Input
          className="bg-white"
          placeholder="Invertor raqami bo'yicha qidirish..."
          value={inventoryNumberFilter}
          onChange={(e) => setInventoryNumberFilter(e.target.value)}
        />
        <AddEquipmentDialog buildingId={buildingId} skladId={skladId} />
      </div>

      {/* Umumiy summani ko'rsatish */}
      <div className="mb-4 text-lg font-semibold">
        <span>Umumiy jihozlar summasi: </span>
        <span>{totalSumInSom.toLocaleString("uz-UZ")} UZS</span>
      </div>

      {/* Jihozlar jadvali */}
      <Table>
        <TableHeader>
          <TableRow className="bg-white p-5">
            <TableCell>
              <strong>Invertor raqami</strong>
            </TableCell>
            <TableCell>
              <strong>Jihoz nomi</strong>
            </TableCell>
            <TableCell>
              <strong>Turi</strong>
            </TableCell>
            <TableCell>
              <strong>Soni</strong>
            </TableCell>
            <TableCell>
              <strong>Donasi narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Umumiy narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Amallar</strong>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEquipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.inventoryNumber}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${formatCurrency(item.pricePerItem)}</TableCell>
              <TableCell>${formatCurrency(item.totalPrice)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditEquipmentDialog
                    buildingId={buildingId}
                    skladId={skladId}
                    equipment={item}
                  />
                  <MoveSkladEquipmentDialog
                    buildingId={buildingId}
                    skladId={skladId}
                    equipment={item}
                  />
                  <DeleteEquipmentModal
                    buildingId={buildingId}
                    skladId={skladId}
                    equipmentId={item.id}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EquipmentTable;
