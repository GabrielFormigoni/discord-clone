"use client";

import React from "react";
import { Plus } from "lucide-react";

import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

type NavigationActionProps = {};

const NavigationAction: React.FC<NavigationActionProps> = () => {
  const { type, isOpen, onClose, onOpen } = useModal();

  const handleClick = () => {
    onOpen("createServer");
  };
  return (
    <div>
      <ActionTooltip label="Add Channel" side="right" align="center">
        <button className="group flex items-center" onClick={handleClick}>
          <div className="flex mx-3 justify-center items-center h-[48px] w-[48px] rounded-[24px] bg-background dark:bg-neutral-700 overflow-hidden group-hover:rounded-[16px] group-hover:bg-emerald-500 transition-all">
            <Plus
              size={25}
              className="group-hover:text-white text-emerald-500 transition"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
export default NavigationAction;
