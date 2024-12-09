"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { db } from "@/app/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { DeleteSkladModal } from "@/app/components/DeleteSkladMdal";
import { UpdateSkladName } from "@/app/components/UpdateSkladName";
import { AddSkladModal } from "@/app/components/AddSkladModal";
import { DeleteRoomModal } from "@/app/components/DeleteRoomModal";

const BinoDetails = () => {
  const paramss = useParams(); // Dinamik paramlarni olish
  const buildingId = paramss?.binoId; // binoId parametri

  const [sklads, setSklads] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sklads uchun real vaqt kuzatuv
    const roomsRef = collection(doc(db, "buildings", buildingId), "rooms");
    const unsubscribeRooms = onSnapshot(roomsRef, (snapshot) => {
      const roomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
      setLoading(false);
    });
    // Sklads uchun real vaqt kuzatuv
    const skladsRef = collection(doc(db, "buildings", buildingId), "sklads");
    const unsubscribeSklads = onSnapshot(skladsRef, (snapshot) => {
      const skladsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSklads(skladsList);
      setLoading(false);
    });

    // Building nomini olish
    const buildingRef = doc(db, "buildings", buildingId);
    const unsubscribeBuilding = onSnapshot(buildingRef, (doc) => {
      if (doc.exists()) {
        setCurrentBuilding(doc.data().name || "Noma'lum bino");
      }
      setLoading(false);
    });

    // Kuzatuvni to'xtatish
    return () => {
      unsubscribeRooms();
      unsubscribeSklads();
      unsubscribeBuilding();
    };
  }, [buildingId]);

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="p-5 w-full bg-slate-100">
      <h1>Bino: {currentBuilding}</h1>
      <AddSkladModal buildingId={buildingId} path="sklads" />
      <h1>Skladlar</h1>
      <div className="py-5 grid grid-cols-4 gap-4">
        {sklads?.map((sklad) => (
          <Card key={sklad?.id} className="relative">
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <EllipsisVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <UpdateSkladName
                    buildingId={buildingId}
                    sklad={sklad}
                    skladName={sklad.name}
                    path="sklads"
                  />
                  <DeleteSkladModal buildingId={buildingId} sklad={sklad} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <h1 className="text-xl">{sklad?.name}</h1>
                </CardTitle>
                <Link href={`/binolar/${buildingId}/${sklad?.id}`}>
                  <Button>
                    <Eye />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <h1>Xonalar</h1>
      <AddSkladModal buildingId={buildingId} path="rooms" />
      <div className="py-5 grid grid-cols-4 gap-4">
        {rooms?.map((room) => (
          <Card key={room?.id} className="relative">
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <EllipsisVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <UpdateSkladName
                    buildingId={buildingId}
                    sklad={room}
                    skladName={room.name}
                    path="rooms"
                  />
                  <DeleteRoomModal buildingId={buildingId} room={room}/>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <h1 className="text-xl">{room?.name}</h1>
                </CardTitle>
                <Link href={`/binolar/${buildingId}/${room?.id}`}>
                  <Button>
                    <Eye />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BinoDetails;
