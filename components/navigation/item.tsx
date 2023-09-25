"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

type NavigationItemProps = {
  id: string;
  name: string;
  imageUrl: string;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  name,
  imageUrl,
}) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <div>
      <ActionTooltip label={name} side="right" align="center">
        <button onClick={onClick} className="group relative flex items-center">
          <div
            className={cn(
              "absolute left-0 w-[4px] bg-primary rounded-r-full transition-all",
              params.serverId !== id && "group-hover:h-[20px]",
              params.serverId === id ? "h-[36px]" : "h-[8px]"
            )}
          />
          <div
            className={cn(
              "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
              params.serverId === id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image src={imageUrl} alt="S" fill />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
export default NavigationItem;
