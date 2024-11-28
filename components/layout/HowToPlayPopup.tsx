import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAviatorSetting } from "@/app/services/apis";
import { config } from "@/lib/config";
import { useAppSelector } from "@/lib/hooks";

interface HowToPlayPopupProps {
  onClose: () => void;
}

interface HowToPlayData {
  _id: string;
  name: string;
  settingText: string;
}

const HowToPlayPopup: React.FC<HowToPlayPopupProps> = ({ onClose }) => {
  const [howToPlayData, setHowToPlayData] = useState<HowToPlayData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const token = useAppSelector((state) => state.aviator.token ?? "");

  useEffect(() => {
    const fetchHowToPlayData = async (token: string) => {
      try {
        const data = await getAviatorSetting(`${config.howToPlay}`, token);
        setHowToPlayData(data);
      } catch (error) {
        console.error("Error fetching 'How To Play' data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHowToPlayData(token);
  }, [token]);

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#27a409] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            HOW TO PLAY?
          </DialogTitle>
          <DialogClose className="absolute top-4 right-4 text-white hover:text-gray-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogClose>
        </DialogHeader>

        <div className="">
          {loading ? (
            <p className="text-white">Loading instructions...</p>
          ) : howToPlayData ? (
            <div className="">
              {/* Embedded video */}
              {/* <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src=""
                  title="How to play Spribe Aviator"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div> */}

              {/* Game instructions */}
              <div
                className="text-white space-y-4"
                dangerouslySetInnerHTML={{ __html: howToPlayData.settingText }}
              />
            </div>
          ) : (
            <p className="text-white">
              Unable to load &#39;How to Play&#39; instructions.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayPopup;
