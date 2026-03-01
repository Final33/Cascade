"use client";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "./Markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Different types of message bubbles.

function IconUser({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
    </svg>
  );
}
function IconOpenAI({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-4", className)}
      viewBox="0 0 1000 1000"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="1000" height="1000" rx="500" fill="black" />
      <path
        d="M633.276 337.6L580.776 385.9L701.176 648.4C707.243 661.467 714.01 672.2 721.476 680.6C728.943 689 735.476 694.6 741.076 697.4C746.676 700.2 751.343 703.933 755.076 708.6C758.81 712.8 760.676 718.4 760.676 725.4C760.676 732.867 757.876 738 752.276 740.8C747.143 743.6 738.043 745 724.976 745H617.876C603.876 745 593.843 743.6 587.776 740.8C581.71 737.533 578.676 732.167 578.676 724.7C578.676 718.633 581.71 712.1 587.776 705.1C593.843 698.1 598.276 691.8 601.076 686.2C603.876 680.133 602.71 669.167 597.576 653.3L508.676 453.1L406.476 548.3V628.1C406.476 646.767 408.81 661.933 413.476 673.6C418.143 684.8 423.043 692.033 428.176 695.3C433.776 698.567 438.91 702.767 443.576 707.9C448.243 712.567 450.576 718.4 450.576 725.4C450.576 732.867 447.776 738 442.176 740.8C436.576 743.6 426.543 745 412.076 745H300.776C286.776 745 276.743 743.6 270.676 740.8C264.61 738 261.576 732.867 261.576 725.4C261.576 718.4 263.91 712.567 268.576 707.9C273.71 702.767 279.076 698.567 284.676 695.3C290.276 692.033 295.41 684.8 300.076 673.6C305.21 661.933 307.776 646.767 307.776 628.1V371.9C307.776 353.233 305.443 338.3 300.776 327.1C296.11 315.433 290.976 307.967 285.376 304.7C279.776 301.433 274.643 297.467 269.976 292.8C265.31 287.667 262.976 281.6 262.976 274.6C262.976 267.133 265.776 262 271.376 259.2C276.976 256.4 287.243 255 302.176 255H413.476C427.476 255 437.276 256.4 442.876 259.2C448.943 262 451.976 267.133 451.976 274.6C451.976 281.6 449.643 287.667 444.976 292.8C440.31 297.467 434.943 301.433 428.876 304.7C423.276 307.967 418.143 315.433 413.476 327.1C408.81 338.3 406.476 353.233 406.476 371.9V485.3L561.176 337.6C570.51 328.733 575.41 321.267 575.876 315.2C576.81 309.133 575.176 304.7 570.976 301.9C566.776 298.633 562.11 294.667 556.976 290C552.31 285.333 549.976 280.2 549.976 274.6C549.976 261.533 559.776 255 579.376 255H673.876C700.01 255 713.076 261.533 713.076 274.6C713.076 283.467 710.276 289.533 704.676 292.8C699.076 296.067 689.043 301.2 674.576 308.2C660.576 315.2 646.81 325 633.276 337.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start ">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 text-sm overflow-hidden whitespace-pre-wrap pl-2">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const text = content;

  return (
    <div className={cn("group relative flex items-start", className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-green-500 text-primary-foreground shadow-sm">
        {/* <IconOpenAI /> */}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose max-w-full break-words text-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, inline, className, children, ...props }) {
              if (typeof children === "string") {
                children = children.replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}
