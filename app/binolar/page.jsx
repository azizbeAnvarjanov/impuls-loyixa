"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AddBuildModal } from "../components/AddBuildModal";
import { EllipsisVertical } from "lucide-react";

import { db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { DeleteBuildingModal } from "../components/DeleteBuildingModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Binolar = () => {
  const [allbuildings, loadin, error] = useCollectionData(
    collection(db, "buildings")
  );

  if (loadin) {
    return <h1>Loading....</h1>;
  }
  if (error) {
    return <h1>Nimadr xatolik yuz berdi !</h1>;
  }

  return (
    <div className="p-5">
      <div className="w-full p-2 flex justify-between border-b-2">
        <h1 className="font-bold text-2xl">Binolar</h1>
        <AddBuildModal />
      </div>
      <div className="py-5 grid grid-cols-4 gap-5">
        {allbuildings?.map((bino) => (
          <Card key={bino?.id} className="relative">
            <div className="right-3 top-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <EllipsisVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DeleteBuildingModal bino={bino} path="buildings" />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <h1 className="text-xl">{bino?.name}</h1>
                </CardTitle>
                <Link href={`/binolar/${bino?.id}`}>
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

export default Binolar;
