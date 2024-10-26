// Avitor.tsx
"use client";

// Define the prop types for Avitor
interface AvitorProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function Avitor({ setIsLoading }: AvitorProps) {
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-[200px] w-full relative border border-[#6666664b] rounded-2xl lg:h-full">
      <iframe
        id="iframeID"
        src="https://elaborate-monstera-c8852a.netlify.app"
        className="h-full w-full rounded-2xl"
        onLoad={handleLoad}
        style={{
          overflow: "hidden",
        }}
      ></iframe>
    </div>
  );
}
