import React from "react";

export const BorderFrame = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border mt-6 flex flex-col w-full items-center bg-white p-6 font-pt ${className}`}
  >
    {children}
  </div>
);
