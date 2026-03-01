"use client";
import { Separator } from "@/components/ui/separator";
import { BotMessage, UserMessage } from "./Messages";
import { SparklesIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function ChatList({
  messages,
  selectedText,
  setSelectedText,
  setInput,
}: {
  messages: any;
  selectedText: any;
  setSelectedText: any;
  setInput: any;
}) {
  return (
    <div className="relative mx-auto px-4 w-full">
      {messages.length === 0 && (
        <div className="w-full px-4 py-4 flex flex-col bg-white space-y-4 justify-center items-center h-full pb-16">
          <SparklesIcon className="h-8 w-8 text-delilahText" />

          <p className="text-[16px] font-bold text-delilahGreyOne whitespace-pre-wrap">
            Examples
          </p>
          <div className="flex flex-col space-y-4">
            <div
              className="flex flex-row items-center border border-delilahGray rounded-xl px-3 py-2 hover:bg-delilahBackground hover:cursor-pointer justify-center"
              onClick={() => {
                if (selectedText) {
                  setInput(
                    "Can you help me show rather than tell in this section?"
                  );
                } else {
                  toast({
                    title: "Error",
                    description: "Please select some text first.",
                  });
                }
              }}
            >
              <p className="text-[14px] text-delilahGreyOne text-center whitespace-pre-wrap">
                Can you help me show not tell in this section?
              </p>
            </div>
            <div
              className="flex flex-row items-center border border-delilahGray rounded-xl px-3 py-2 hover:bg-delilahBackground hover:cursor-pointer justify-center"
              onClick={() => {
                if (selectedText) {
                  setInput(
                    "Can you make this a little more simple and straightforward but keep some of the unique formatting?"
                  );
                } else {
                  toast({
                    title: "Error",
                    description: "Please select some text first.",
                  });
                }
              }}
            >
              <p className="text-[14px] text-delilahGreyOne whitespace-pre-wrap">
                Can you make this a little more simple and straightforward but
                keep some of the unique formatting?
              </p>
            </div>

            <div
              className="flex flex-row items-center border border-delilahGray rounded-xl px-3 py-2 hover:bg-delilahBackground hover:cursor-pointer justify-center"
              onClick={() => {
                if (selectedText) {
                  setInput(
                    "Keep the writing in paragraphs, and make it more concise."
                  );
                } else {
                  toast({
                    title: "Error",
                    description: "Please select some text first.",
                  });
                }
              }}
            >
              <p className="text-[14px] text-delilahGreyOne whitespace-pre-wrap">
                Keep the writing in paragraphs, and make it more concise.
              </p>
            </div>
          </div>
        </div>
      )}

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
