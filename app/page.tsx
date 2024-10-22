// import Avitor from "@/components/layout/Avitor"
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-[#0e0e0e]">
      <div className="flex-1">
        <Avitor />
      </div>
      <div className="flex-1">
        <BetControl />
      </div>
    </main>
  );
}
