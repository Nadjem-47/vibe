"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Home() {
  const [input, setInput] = useState("");

  const trpc = useTRPC();
  const {data: messages} = useQuery(trpc.messages.getMany.queryOptions())
  const createMessage = useMutation(trpc.messages.create.mutationOptions({}));

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
        onClick={() => createMessage.mutate({value: input})}
        className="bg-rose-500 text-white px-4 py-2 rounded"
      >
        Set Value
      </button>
      <div className="mt-4">Value: {JSON.stringify(messages)}</div>
    </div>
  );
}
