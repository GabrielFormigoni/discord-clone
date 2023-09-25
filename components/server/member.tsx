"use client";

import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfiles } from "@/types";
import { Member, MemberRole, Profile } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../user-avatar";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: ServerWithMembersWithProfiles;
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 w-7 h-7 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 w-7 h-7 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

const ServerMember: React.FC<ServerMemberProps> = ({ member, server }) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 flex items-center rounded-md gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="w-6 h-6 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-[10px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
export default ServerMember;
