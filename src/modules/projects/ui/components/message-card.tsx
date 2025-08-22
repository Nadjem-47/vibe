"use client";

import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import Image from "next/image";
import { format } from "date-fns";
import React from "react";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: string | Date;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
  isActiveFragment?:boolean;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onClick,
}: {
  fragment: Fragment;
  isActiveFragment: boolean;
  onClick: (fragment: Fragment) => void;
}) => (
  <div
    onClick={() => onClick(fragment)}
    className={cn(
      "group cursor-pointer rounded-xl p-4 text-sm transition-all duration-300 shadow-sm border",
      "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
      isActiveFragment 
        ? "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-blue-100 dark:from-blue-950/50 dark:to-indigo-900/50 dark:border-blue-700 dark:shadow-blue-900/20" 
        : "bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50"
    )}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        Fragment Preview
      </p>
      <div className="text-xs text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400 transition-colors">
        {fragment.title}
      </div>
    </div>
    <div className="text-xs text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
      <span className="font-mono text-blue-600 dark:text-blue-400">{Object.keys(fragment.files as Record<string, unknown>).length} files</span>
    </div>
  </div>
);

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  type,
  isActiveFragment,
  onFragmentClick,
}: MessageCardProps) => {
  
  switch (role) {
    case "USER":
      return (
        <div className="flex justify-end">
          <UserMessage
            content={content}
            createdAt={createdAt}
            fragment={fragment}
            onFragmentClick={onFragmentClick}
          />
        </div>
      );
    case "ASSISTANT":
      return (
        <div className="flex justify-start">
          <AssistantMessage
            content={content}
            createdAt={createdAt}
            fragment={fragment}
            type={type}
            onFragmentClick={onFragmentClick}
            isActiveFragment={isActiveFragment}
          />
        </div>
      );
    default:
      return (
        <div className="relative w-fit max-w-xs rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{role}</span>
            <span className="text-gray-400 dark:text-gray-500">{format(new Date(createdAt), "HH:mm")}</span>
          </div>
          <div className="whitespace-pre-line break-words text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{content}</div>
          {fragment && type === "RESULT" && (
            <div className="mt-4">
              <FragmentCard
                fragment={fragment}
                isActiveFragment={!!isActiveFragment}
                onClick={onFragmentClick}
              />
            </div>
          )}
          <span className="absolute bottom-2 left-4 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full">
            {type.toLowerCase()}
          </span>
        </div>
      );
  }
};

const UserMessage = ({
  content,
  createdAt,
  fragment,
  onFragmentClick,
}: Omit<MessageCardProps, "role" | "type">) => (
  <div className="relative w-fit max-w-md rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-5 mb-4 shadow-lg border border-blue-400/20 dark:border-blue-500/20">
    <div className="mb-3 flex items-center justify-between text-xs text-blue-100 dark:text-blue-200">
      <span className="font-semibold bg-blue-400/30 dark:bg-blue-500/30 px-3 py-1 rounded-full">You</span>
      <span className="text-blue-200 dark:text-blue-300">{format(new Date(createdAt), "HH:mm")}</span>
    </div>
    <div className="whitespace-pre-line break-words text-sm text-white dark:text-gray-100 leading-relaxed">{content}</div>
    {fragment && (
      <button
        onClick={() => onFragmentClick(fragment)}
        className="mt-4 w-fit rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-2 text-xs text-white dark:text-gray-100 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 hover:shadow-lg border border-white/30 dark:border-white/20"
      >
        View Fragment
      </button>
    )}
  </div>
);

const AssistantMessage = ({
  content,
  createdAt,
  fragment,
  type,
  onFragmentClick,
  isActiveFragment,
}: Omit<MessageCardProps, "role"> & { isActiveFragment?: boolean }) => {
  const formattedTime = createdAt ? format(new Date(createdAt), "HH:mm") : "--:--";
  const isError = type === "ERROR";
  const isResult = type === "RESULT";

  return (
    <div
      className={cn(
        "relative w-fit max-w-md rounded-2xl p-5 shadow-lg mb-8 flex flex-col gap-4 border transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.01]",
        isError 
          ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-red-100 dark:from-red-950/50 dark:to-red-900/50 dark:border-red-700 dark:shadow-red-900/20" 
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:shadow-gray-900/20"
      )}
    >
      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="relative">
          <Image
            src="/logo.svg"
            alt="Assistant"
            width={24}
            height={24}
            className="rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-600"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
        <span className={cn(
          "font-semibold px-3 py-1 rounded-full text-xs",
          isError 
            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" 
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
        )}>
          Assistant
        </span>
        <span className="ml-auto text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {formattedTime}
        </span>
      </div>

      <div
        className={cn(
          "whitespace-pre-line break-words text-sm leading-relaxed",
          isError ? "text-red-700 dark:text-red-300" : "text-gray-800 dark:text-gray-200"
        )}
      >
        {content || (
          <span className="italic text-gray-400 dark:text-gray-500">No content provided</span>
        )}
      </div>

      {fragment && isResult && (
        <div className="mt-2">
          <FragmentCard
            fragment={fragment}
            isActiveFragment={!!isActiveFragment}
            onClick={onFragmentClick}
          />
        </div>
      )}

      {isResult && !fragment && (
        <div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            No fragment available.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span
          className={cn(
            "text-xs px-3 py-1 rounded-full font-medium",
            isError 
              ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300" 
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          )}
        >
          {type.toLowerCase()}
        </span>
        {fragment && (
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {Object.keys(fragment.files as Record<string, unknown>).length} files
          </div>
        )}
      </div>
    </div>
  );
};
