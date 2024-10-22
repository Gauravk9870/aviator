// import Avitor from "@/components/layout/Avitor"
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";

export default function Home() {
  return (
    <main className=" h-full overflow-scroll flex flex-col justify-between bg-[#0e0e0e] hide-scrollbar">
      <div className="flex-1">
        <Avitor />
      </div>{" "}
      <BetControl />
    </main>
  );
}
