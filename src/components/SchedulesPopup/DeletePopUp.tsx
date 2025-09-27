import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  
  interface ConfirmDeletePopupProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    trainNumber?: string
  }
  
  export function ConfirmDeletePopup({
    open,
    onClose,
    onConfirm,
    trainNumber,
  }: ConfirmDeletePopupProps) {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Train</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete train{" "}
              <span className="font-semibold">{trainNumber}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  