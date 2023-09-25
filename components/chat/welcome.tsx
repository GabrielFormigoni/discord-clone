import { Hash } from "lucide-react";
import React from "react";

type ChatWelcomeProps = {
  name: string;
  type: "channel" | "conversation";
};

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ name, type }) => {
  return (
    <div className="space-y-4 px-4 mb-4">
      {type === "channel" && (
        <div className="flex items-center justify-center bg-zinc-500 dark:bg-zinc-700 rounded-full w-20 h-20">
          <Hash className="text-white h-12 w-12" />
        </div>
      )}
      <p className="font-bold text-xl md:text-3xl ">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="md:text-lg text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the beginning of the channel ${name}.`
          : `This is the beggining of your conversation with ${name}.`}
      </p>
    </div>
  );
};
export default ChatWelcome;
