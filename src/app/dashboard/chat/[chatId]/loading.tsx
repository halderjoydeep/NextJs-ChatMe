import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

const loading: React.FC = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-3 border-b border-gray-300 bg-white p-4 py-3">
        <Skeleton width={40} height={40} borderRadius={999} />
        <div className="flex flex-col">
          <Skeleton width={150} height={20} />
          <Skeleton width={250} height={16} />
        </div>
      </div>

      <div className="scrollbar-thumb-blue scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-rounded flex flex-1 flex-col-reverse gap-4 overflow-y-auto scroll-smooth p-3">
        <div className="rounded-lg p-3">
          <div className="flex flex-row items-center">
            <div className="relative h-10 w-10">
              <Skeleton width={40} height={40} borderRadius={999} />
            </div>
            <div className="relative ml-3 rounded-xl border border-gray-100 bg-white px-4 py-2">
              <Skeleton width={150} height={20} />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3">
          <div className="flex flex-row-reverse items-center">
            <div className="relative h-10 w-10">
              <Skeleton width={40} height={40} borderRadius={999} />
            </div>
            <div className="relative mr-3 rounded-xl border  border-gray-100 bg-white px-4 py-2">
              <Skeleton width={250} height={20} />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3">
          <div className="mr-10 flex flex-row-reverse items-center">
            <div className="relative mr-3 rounded-xl border  border-gray-100 bg-white px-4 py-2">
              <Skeleton width={150} height={20} />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3">
          <div className="flex flex-row items-center">
            <div className="relative h-10 w-10">
              <Skeleton width={40} height={40} borderRadius={999} />
            </div>
            <div className="relative ml-3 rounded-xl border border-gray-100 bg-white px-4 py-2">
              <Skeleton width={270} height={20} />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3">
          <div className="flex flex-row-reverse items-center">
            <div className="relative h-10 w-10">
              <Skeleton width={40} height={40} borderRadius={999} />
            </div>
            <div className="relative mr-3 rounded-xl border  border-gray-100 bg-white px-4 py-2">
              <Skeleton width={130} height={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4">
        <div className="relative rounded-lg shadow-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-purple-500">
          <div className="block w-full resize-none border-0 bg-transparent py-1.5 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:ring-0" />

          <div className="h-14" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default loading;
