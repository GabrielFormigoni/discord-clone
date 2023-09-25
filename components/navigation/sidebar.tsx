import React from "react";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import NavigationAction from "@/components/navigation/action";
import NavigationItem from "@/components/navigation/item";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

type NavigationSidebarProps = {};

const NavigationSidebar: React.FC<NavigationSidebarProps> = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 py-3 flex flex-col items-center w-full h-full text-primary dark:bg-[#1E1F22] bg-[#E3E5E8]">
      <NavigationAction />
      <Separator className="bg-zinc-300 h-[2px] dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 h-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center pb-3 gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
export default NavigationSidebar;
