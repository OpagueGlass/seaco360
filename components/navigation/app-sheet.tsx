import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/navigation/menu";
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export function AppSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="h-8" variant="outline" size="icon" onClick={() => setIsSheetOpen(true)}>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col bg-background/80 backdrop-blur-md" side="left">
        <SheetHeader>
          <Button className="flex justify-center items-center pb-2 pt-1" variant={null} asChild>
            <Link href="/" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <SheetTitle className="font-bold text-lg">SEACO 360</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen setIsOpen={setIsSheetOpen} />
      </SheetContent>
    </Sheet>
  );
}
