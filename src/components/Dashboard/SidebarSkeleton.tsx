import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="w-full h-full max-h-[100vh] flex-col gap-2 bg-gray-100 animate-pulse">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] py-8 lg:px-6">
        <div className="w-20 h-8 bg-gray-300 rounded"></div>
      </div>
      <div className="flex w-full flex-col gap-2 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-8 bg-gray-300 rounded w-full"></div>
        ))}
      </div>
      <div className="flex-auto flex-col text-sm font-medium p-4">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-7 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 bg-gray-100 w-full px-3 py-2 border-t">
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-8 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
