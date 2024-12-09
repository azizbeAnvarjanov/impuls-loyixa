"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

const DashboardPage = () => {
  const [totalBuildings, setTotalBuildings] = useState(0);
  const [totalSklads, setTotalSklads] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [totalEquipmentValue, setTotalEquipmentValue] = useState(0);
  const [loading, setLoading] = useState(true); // Loading holati

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true); // Ma'lumotlarni olishni boshlash
      let buildingsCount = 0;
      let skladsCount = 0;
      let roomsCount = 0;
      let equipmentCount = 0;
      let equipmentValueSum = 0;

      const buildingsRef = collection(db, "buildings");
      const buildingsSnapshot = await getDocs(buildingsRef);
      buildingsCount = buildingsSnapshot.docs.length;

      for (const buildingDoc of buildingsSnapshot.docs) {
        const buildingId = buildingDoc.id;

        // Skladlar sonini olish
        const skladsRef = collection(doc(db, "buildings", buildingId), "sklads");
        const skladsSnapshot = await getDocs(skladsRef);
        skladsCount += skladsSnapshot.docs.length;

        for (const skladDoc of skladsSnapshot.docs) {
          const skladId = skladDoc.id;

          // Skladlardagi jihozlarni hisoblash
          const equipmentRef = collection(
            doc(db, "buildings", buildingId, "sklads", skladId),
            "equipment"
          );
          const equipmentSnapshot = await getDocs(equipmentRef);
          equipmentCount += equipmentSnapshot.docs.length;

          equipmentSnapshot.docs.forEach((doc) => {
            equipmentValueSum += doc.data().totalPrice || 0;
          });
        }

        // Xonalar sonini olish
        const roomsRef = collection(doc(db, "buildings", buildingId), "rooms");
        const roomsSnapshot = await getDocs(roomsRef);
        roomsCount += roomsSnapshot.docs.length;

        for (const roomDoc of roomsSnapshot.docs) {
          const roomId = roomDoc.id;

          // Xonalardagi jihozlarni hisoblash
          const equipmentRef = collection(
            doc(db, "buildings", buildingId, "rooms", roomId),
            "equipment"
          );
          const equipmentSnapshot = await getDocs(equipmentRef);
          equipmentCount += equipmentSnapshot.docs.length;

          equipmentSnapshot.docs.forEach((doc) => {
            equipmentValueSum += doc.data().totalPrice || 0;
          });
        }
      }

      setTotalBuildings(buildingsCount);
      setTotalSklads(skladsCount);
      setTotalRooms(roomsCount);
      setTotalEquipment(equipmentCount);
      setTotalEquipmentValue(equipmentValueSum);
      setLoading(false); // Ma'lumotlar yuklanib bo'ldi
    };

    fetchDashboardData();
  }, []);

  function formatCurrency(amount) {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-100">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Barcha Binolar</h2>
          <p className="text-2xl">{totalBuildings}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Barcha Skladlar</h2>
          <p className="text-2xl">{totalSklads}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Barcha Xonalar</h2>
          <p className="text-2xl">{totalRooms}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Barcha Jihozlar</h2>
          <p className="text-2xl">{totalEquipment}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Barcha Jihozlar Summasi</h2>
          <p className="text-2xl">{formatCurrency(totalEquipmentValue)}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
