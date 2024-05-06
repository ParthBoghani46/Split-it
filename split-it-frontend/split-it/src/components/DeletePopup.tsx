// Importing icons from lucide-react package
import { Trash2 } from "lucide-react";

// Importing Button component from local UI folder
import { Button } from "@/components/ui/button";

// Importing Dialog components from local UI folder
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeletePopup({ onDelete }: { onDelete: () => Promise<void> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex items-center justify-center bg-red-400 rounded-lg p-2 px-3 hover:bg-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-600">
        <DialogTitle className="dark:text-white text-card">
          Delete this expense?
        </DialogTitle>
        <DialogDescription className="dark:text-white text-card">
          Do you really want to delete this expense? This action is
          irreversible.
        </DialogDescription>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="bg-red-400 p-1 px-4 hover:bg-red-500 rounded-lg"
          >
            Yes
          </Button>
          <DialogClose asChild>
            <Button
              variant={"secondary"}
              className="bg-green-400 p-1 px-3 hover:bg-green-500 rounded-lg"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
