import { useEffect, useState } from "react";
import Image from 'next/image'

export const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Generating response...",
    "Fetching data...",
    "Composing the best answer...",
    "Double-checking sources...",
    "Adding final touches...",
    "Almost done...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2 p-4 text-sm text-gray-500 animate-pulse">
      <svg
        className="h-4 w-4 animate-spin text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span>{messages[currentMessageIndex]}</span>
    </div>
  );
};


export const MessageLoading = () => {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image src="/logo.svg" alt="vibe" width={18} height={18} className="shrink-0"/>
                <span className="text-sm font-medium">AI Agent</span>
            </div>
            <div className="pl-8 5 flex flex-col gap-y-4">
                <ShimmerMessages /> 
            </div>
        </div>
    )
}
