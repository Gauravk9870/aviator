import Avitor from "@/components/layout/Avitor"
import BetControl from "@/components/layout/BetControl";

export default function Home() {
  return (
    <main className=" h-full overflow-scroll flex flex-col justify-between">
      <Avitor />
      <BetControl/>
    </main>
  );
}
