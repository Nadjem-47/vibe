import { caller } from "@/trpc/server";

export default async function Home() {

   const data = await caller.createAi({text: "Anna"})


  return <div className="font-bold text-rose-500">{data?.greeting}</div>
}
