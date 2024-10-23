// import Avitor from "@/components/layout/Avitor";
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";

export default function Home() {
  return (
    <main className="lg:h-[calc(100vh-119.5px)] flex flex-col bg-[#0e0e0e]  p-2">
      <div className="flex-2 flex-grow-[2]">
        <Avitor />
      </div>
      <div className="flex-1 flex-grow">
        <BetControl />
      </div>
    </main>
  );
}
