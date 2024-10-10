import React from "react";

const ErrorComponent = ({ refetch }: { refetch: () => void }) => {
  return (
    <div className=" text-center text-red-500">
      <p>Something bad happened</p>
    </div>
  );
};

export default ErrorComponent;
