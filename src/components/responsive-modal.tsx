import { useMedia } from "react-use";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "lg" | "xl" | "2xl";
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  size = "lg",
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "w-full p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]",
            {
              "sm:max-w-lg": size === "lg",
              "sm:max-w-xl": size === "xl",
              "sm:max-w-2xl": size === "2xl",
            }
          )}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
