import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

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
  cancelReason: string;
  setCancelReason: any;
};

const OrderCancelBox = ({
  buttonName,
  buttonSize,
  buttonVariant,
  confirmTitle,
  confirmDescription,
  confirmButtonText,
  run,
  className,
  cancelReason,
  setCancelReason,
}: ConfirmTypes) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=""
    >
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
              Reason for canceling the order.
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <RadioGroup
                onClick={(event) => {
                  event.stopPropagation();
                }}
                defaultValue="comfortable"
                onValueChange={(e) => {
                  if (e == "other") {
                    setOpen(true);
                    setCancelReason("");
                  } else {
                    setOpen(false);
                    setCancelReason(e);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Out of Stock" id="Out of Stock" />
                  <Label htmlFor="Out of Stock">Out of Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Shipping Restriction"
                    id="Shipping Restriction"
                  />
                  <Label htmlFor="Shipping Restriction">
                    Shipping Restriction
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Technical Error"
                    id="Technical Error"
                  />
                  <Label htmlFor="Technical Error">Technical Error</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
                {open && (
                  <Textarea
                    value={cancelReason}
                    id="other"
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                )}
              </RadioGroup>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelReason == ""}
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
    </div>
  );
};

export default OrderCancelBox;
