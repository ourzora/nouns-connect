import React from "react";

export const PageFrameSize = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative max-w-2xl w-full mt-20 mx-4">
      {children}
    </div>
  );
};
