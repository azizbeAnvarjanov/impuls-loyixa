import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";

export function DeleteRoomModal({ buildingId, room }) {
  const deleteRoom = async () => {
    try {
      const roomDocRef = doc(db, "buildings", buildingId, "rooms", room.id);
      await deleteDoc(roomDocRef);
      toast.success("Xona muvaffaqiyatli o'chirildi:", room.id);
    } catch (error) {
      toast.error("Xona o'chirishda xatolik:", error.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          O'chirish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rostan ham o'chirmoqchimiz !</AlertDialogTitle>
          <AlertDialogDescription>
            Agar xonani o'chirsangiz ichidagi barcha jihozlar ham o'chib ketadi
            tiklab bo'lmaydi !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogCancel variant="destructive" onClick={deleteRoom}>
            O'chirish
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
