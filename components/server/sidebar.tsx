import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ChannelType, MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import ServerHeader from "./header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "@/components/server/search";
import { Separator } from "../ui/separator";
import ServerSection from "./section";
import ServerChannel from "./channel";
import ServerMember from "./member";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 w-4 h-4" />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 w-4 h-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 w-4 h-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};
const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        <div className="space-y-[2px]">
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Text Channels"
                sectionType="channels"
                channelType={ChannelType.TEXT}
                role={role}
              />
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-[2px]">
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Voice Channels"
                sectionType="channels"
                channelType={ChannelType.AUDIO}
                role={role}
              />
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-[2px]">
          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                label="Video Channels"
                sectionType="channels"
                channelType={ChannelType.VIDEO}
                role={role}
              />
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-[2px]">
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                label="Members"
                sectionType="members"
                role={role}
                server={server}
              />
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
export default ServerSidebar;