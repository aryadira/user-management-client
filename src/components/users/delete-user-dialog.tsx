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
import axios from "axios";
import { DeleteIcon } from "lucide-react";
import { useCallback, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const AUTH_TOKEN = "Bearer 3|uI7zw1mYimbDXouVu7P6g8RHYi4vjU4udR2PLCSc21483a17";

export function DeleteUserDialog({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.delete(`${API_BASE_URL}/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: AUTH_TOKEN,
        },
      });

      if (response.status === 200) {
        onDelete(id); // Hapus dari state parent tanpa reload halaman
      } else {
        setError("Failed to delete user.");
      }
    } catch (err) {
      setError("An error occurred while deleting the user.");
    } finally {
      setLoading(false);
    }
  }, [id, onDelete]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>
          <DeleteIcon className='size-5' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the user from our system.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
