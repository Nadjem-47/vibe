"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const [input, setInput] = useState("");

  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));

  return (
    <div className="font-bold text-rose-500">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Type something..."
      />
      <button
        onClick={() => invoke.mutate({text: input})}
        className="bg-rose-500 text-white px-4 py-2 rounded"
      >
        Set Value
      </button>
      <div className="mt-4">Value: {input}</div>
      {/* {data?.greeting} */}
    </div>
  );
}
