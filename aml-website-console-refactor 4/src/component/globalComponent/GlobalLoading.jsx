import React from "react";

const GlobalLoading = ({color}) => {
  return (
    <div 
    className="flex justify-center items-center">
      <div
     style={{border:`4px solid ${color}`}}

       className="w-6 h-6  border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoading;
