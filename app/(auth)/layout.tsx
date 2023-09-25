import React from "react";

type layoutProps = {
  children: React.ReactNode;
};

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex h-full justify-center items-center">{children}</div>
  );
};
export default layout;
