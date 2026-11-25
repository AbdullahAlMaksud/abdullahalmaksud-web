import React from "react";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black">
      <div className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="h-3.5 w-36 animate-pulse bg-neutral-200" />
          <div className="flex gap-5">
            <div className="h-3.5 w-12 animate-pulse bg-neutral-200" />
            <div className="h-3.5 w-12 animate-pulse bg-neutral-200" />
            <div className="h-3.5 w-12 animate-pulse bg-neutral-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 px-5 py-16 sm:px-8">
        <div className="space-y-4">
          <div className="h-3 w-48 animate-pulse bg-neutral-200" />
          <div className="h-12 w-72 animate-pulse bg-neutral-200 sm:w-96" />
          <div className="h-5 w-full max-w-xl animate-pulse bg-neutral-100" />
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-neutral-200 pt-10 md:grid-cols-12">
          <div className="space-y-3 md:col-span-4">
            <div className="h-3 w-28 animate-pulse bg-neutral-200" />
            <div className="h-7 w-44 animate-pulse bg-neutral-200" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-8">
            <div className="space-y-3">
              <div className="h-3 w-20 animate-pulse bg-neutral-200" />
              <div className="h-6 w-48 animate-pulse bg-neutral-200" />
              <div className="h-16 w-full animate-pulse bg-neutral-100" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-20 animate-pulse bg-neutral-200" />
              <div className="h-6 w-48 animate-pulse bg-neutral-200" />
              <div className="h-16 w-full animate-pulse bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
