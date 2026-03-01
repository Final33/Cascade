"use client";
import { Separator } from "@/components/ui/separator";
import { BotMessage, UserMessage } from "./Messages";
import { SparklesIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function ChatList({
  messages,
  setInput,
}: {
  messages: any;
  setInput: any;
}) {
  return (
    <div className="relative mx-auto  px-4">
      {messages.map((message: any, index: any) => (
        <div key={message.id}>
          {message.role === "assistant" ? (
            <BotMessage content={message.content} />
          ) : (
            <UserMessage>{message.content}</UserMessage>
          )}

          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
}
