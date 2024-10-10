import React from "react";

const Heading = ({ header, desc }: { header: string; desc: string }) => {
  return (
    <div className="  capitalize flex flex-col gap-[10px]">
      <p className=" text-[24px] lg:text-3xl font-bold uppercase">{header}</p>
      <p className="  font-normal text-[#181818] text-sm">{desc}</p>
    </div>
  );
};

export default Heading;
