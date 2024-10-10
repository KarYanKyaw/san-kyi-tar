import React from "react";
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
import { Button } from "./ui/button";

type ConfirmTypes = {
  buttonName: string | React.ReactNode;
  buttonSize?: "default" | "sm" | "lg" | "icon" | null;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  confirmTitle: string;
  confirmDescription: string;
  confirmButtonText: string;
  className?: string;
  run: () => void;
};

const ConfirmBox = ({
  buttonName,
  buttonSize,
  buttonVariant,
  confirmTitle,
  confirmDescription,
  confirmButtonText,
  run,
  className,
}: ConfirmTypes) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={buttonSize}
          variant={buttonVariant}
          className={className}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {buttonName}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {confirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              run();
              e.stopPropagation();
            }}
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmBox;
