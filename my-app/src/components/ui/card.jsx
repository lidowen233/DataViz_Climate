// src/components/ui/card.jsx
import React from "react";
import clsx from "clsx";

export const Card = ({ children, className }) => (
  <div
    className={clsx(
      "rounded-xl bg-white w-full mx-auto",
      className
    )}
  >
    {children}
  </div>
);


export const CardContent = ({ children, className }) => (
  <div
    className={clsx(
      "mt-2 text-gray-700 text-sm break-words whitespace-normal",
      className
    )}
  >
    {children}
  </div>
);
