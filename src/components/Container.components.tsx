import React from "react";

type container = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: container) => {
  return (
    <div className={`mx-auto h-full w-[95%] ${className}`}>{children}</div>
  );
};

export default Container;
