"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "@/app/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const BarchaJixozlar = () => {
  const [allEquipment, setAllEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllEquipment = async () => {
      const buildingsRef = collection(db, "buildings");
      const buildingsSnapshot = await getDocs(buildingsRef);

      const allEquipmentList = [];


      for (const buildingDoc of buildingsSnapshot.docs) {
        const buildingId = buildingDoc.id;
        const buildingData = buildingDoc.data();

        // Skladlar ichidagi jihozlarni olish
        const skladsRef = collection(
          doc(db, "buildings", buildingId),
          "sklads"
        );
        const skladsSnapshot = await getDocs(skladsRef);

        for (const skladDoc of skladsSnapshot.docs) {
          const skladId = skladDoc.id;
          const skladData = skladDoc.data();

          const equipmentRef = collection(
            doc(db, "buildings", buildingId, "sklads", skladId),
            "equipment"
          );
          const equipmentSnapshot = await getDocs(equipmentRef);

          for (const equipmentDoc of equipmentSnapshot.docs) {
            allEquipmentList.push({
              ...equipmentDoc.data(),
              id: equipmentDoc.id,
              buildingName: buildingData.name,
              locationType: "Sklad",
              locationName: skladData.name,
            });
          }
        }

        // Xonalar ichidagi jihozlarni olish
        const roomsRef = collection(doc(db, "buildings", buildingId), "rooms");
        const roomsSnapshot = await getDocs(roomsRef);

        for (const roomDoc of roomsSnapshot.docs) {
          const roomId = roomDoc.id;
          const roomData = roomDoc.data();

          const equipmentRef = collection(
            doc(db, "buildings", buildingId, "rooms", roomId),
            "equipment"
          );
          const equipmentSnapshot = await getDocs(equipmentRef);

          for (const equipmentDoc of equipmentSnapshot.docs) {
            allEquipmentList.push({
              ...equipmentDoc.data(),
              id: equipmentDoc.id,
              buildingName: buildingData.name,
              locationType: "Xona",
              locationName: roomData.name,
            });
          }
        }
      }

      setAllEquipment(allEquipmentList);
    };

    fetchAllEquipment();
  }, []);

  const filteredEquipment = allEquipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatCurrency(amount) {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
    }).format(amount);
  }

  

  return (
    <div className="p-5 bg-slate-100">
      <h1 className="text-2xl mb-4">Barcha Jihozlar</h1>

      {/* Qidiruv paneli */}
      <Input
        placeholder="Jihoz nomi bo‘yicha qidirish..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      

      {/* Jihozlar jadvali */}
      <Table>
        <TableHeader>
          <TableRow>
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
              <strong>Dona narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Umumiy narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Joylashuvi</strong>
            </TableCell>
            <TableCell>
              <strong>Bino nomi</strong>
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
              <TableCell>{formatCurrency(item.pricePerItem)}</TableCell>
              <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
              <TableCell>
                {item.locationType}: {item.locationName}
              </TableCell>
              <TableCell>{item.buildingName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BarchaJixozlar;
