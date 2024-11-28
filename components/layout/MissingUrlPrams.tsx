import React from "react";

const MissingUrlPrams = ({ message }: { message: string }) => {
  return (
    <div className=" w-full h-screen  flex items-center justify-center">
      <p className=" min-w-[18.75rem] max-w-[50rem]  border border-[#d8001e] bg-[#b3021b]  py-[0.75rem] px-[1.25rem] rounded-[10px] text-sm text-center text-white">
        {message}
      </p>
    </div>
  );
};

export default MissingUrlPrams;
