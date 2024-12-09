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

export function DeleteSkladModal({ buildingId, sklad }) {
  const deleteSklad = async () => {
    try {
      const skladDocRef = doc(db, "buildings", buildingId, "sklads", sklad.id);
      await deleteDoc(skladDocRef);
      toast.success("Sklad muvaffaqiyatli o'chirildi:", sklad.id);
    } catch (error) {
      toast.error("Sklad o'chirishda xatolik:", error.message);
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
            Agar binoni o'chirsangiz ichidagi barcha jihozlar ham o'chib ketadi
            tiklab bo'lmaydi !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogCancel variant="destructive" onClick={deleteSklad}>
            O'chirish
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
