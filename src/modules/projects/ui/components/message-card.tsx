"use client";

import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import Image from "next/image";
import { format } from "date-fns";
import React from "react";

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragments: Fragment | null;
  createdAt: string | Date;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
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
    className={`cursor-pointer rounded-xl p-4 text-sm transition-colors duration-200 shadow-sm ${
      isActiveFragment ? "bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
    }`}
  >
    <p className="mb-2 font-medium text-gray-500">Fragment Preview</p>
    <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">
      {JSON.stringify(fragment, null, 2)}
    </pre>
  </div>
);

export const MessageCard = ({
  content,
  role,
  fragments,
  createdAt,
  type,
  onFragmentClick,
}: MessageCardProps) => {
  switch (role) {
    case "USER":
      return (
        <div className="flex justify-end">
          <UserMessage
            content={content}
            createdAt={createdAt}
            fragments={fragments}
            type={type}
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
            fragments={fragments}
            type={type}
            onFragmentClick={onFragmentClick}
          />
        </div>
      );
    default:
      return (
        <div className="relative w-fit max-w-xs rounded-2xl bg-gray-100 p-5 shadow">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold">{role}</span>
            <span>{format(new Date(createdAt), "HH:mm")}</span>
          </div>
          <div className="whitespace-pre-line break-words text-sm text-gray-800">{content}</div>
          {fragments && type === "RESULT" && (
            <FragmentCard
              fragment={fragments}
              isActiveFragment
              onClick={onFragmentClick}
            />
          )}
          <span className="absolute bottom-2 left-4 text-xs text-gray-400">{type}</span>
        </div>
      );
  }
};

const UserMessage = ({
  content,
  createdAt,
  fragments,
  type,
  onFragmentClick,
}: Omit<MessageCardProps, "role">) => (
  <div className="relative w-fit max-w-xs rounded-2xl bg-gray-200 p-5 mb-2 shadow">
    <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
      <span className="font-semibold">You</span>
      <span>{format(new Date(createdAt), "HH:mm")}</span>
    </div>
    <div className="whitespace-pre-line break-words text-sm text-gray-900">{content}</div>
    {fragments && (
      <button
        onClick={() => onFragmentClick(fragments)}
        className="mt-3 w-fit rounded-full bg-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-400"
      >
        View Fragment
      </button>
    )}
  </div>
);

const AssistantMessage = ({
  content,
  createdAt,
  fragments,
  type,
  onFragmentClick,
}: Omit<MessageCardProps, "role">) => (
  <div className="relative w-fit max-w-xs rounded-2xl bg-white p-5 shadow">
    <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
      <Image
        src="/logo.svg"
        alt="Assistant"
        width={18}
        height={18}
        className="rounded-full bg-white"
      />
      <span className="font-semibold text-gray-500">Assistant</span>
      <span className="ml-auto text-gray-400">{format(new Date(createdAt), "HH:mm")}</span>
    </div>
    <div className="whitespace-pre-line break-words text-sm text-gray-900">
      {content}
    </div>
    {fragments && type === "RESULT" && (
      <FragmentCard
        fragment={fragments}
        isActiveFragment
        onClick={onFragmentClick}
      />
    )}
    <span className="absolute bottom-2 left-4 text-xs text-gray-400">{type}</span>
  </div>
);
