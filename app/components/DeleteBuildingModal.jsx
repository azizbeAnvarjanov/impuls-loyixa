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

export function DeleteBuildingModal({ bino }) {
  const deleteBulding = async () => {
    await deleteDoc(doc(db, "buildings", bino.id));
    toast.success(`bulding deleted !`);
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
            Agar binoni o'chirsangiz ichidagi barcha jihozlar ham o'chib ketadi
            tiklab bo'lmaydi !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <Button variant="destructive" onClick={deleteBulding}>
            O'chirish
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
