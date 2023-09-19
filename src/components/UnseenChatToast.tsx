import { chatIdConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import toast, { Toast } from "react-hot-toast";

interface UnseenChatToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  message: string;
}

const UnseenChatToast: React.FC<UnseenChatToastProps> = ({
  t,
  sessionId,
  senderId,
  senderName,
  senderImage,
  message,
}) => {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
      )}
    >
      <a
        className="w-0 flex-1 p-4"
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatIdConstructor(sessionId, senderId)}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                src={senderImage}
                fill
                alt={`${senderName} profile picture`}
                referrerPolicy="no-referrer"
                className="rounded-full"
              />
            </div>
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </a>

      <div className="border-1 flex border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnseenChatToast;
