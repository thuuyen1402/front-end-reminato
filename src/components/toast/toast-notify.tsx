import dayjs from "dayjs";
import toast, { Toast } from "react-hot-toast";

export interface ToastNotify {
    className?: string;
    t: Toast;
    info?: NotifyServiceConsume
}
export function ToastNotify({ className = "", t, info }: ToastNotify) {

    //Fire event test not trigger with a tag
    const openNewTab = () => {
        window.open(`https://youtube.com/watch?v=${info?.id ?? "Unknown"}`, "_blank")
    }

    return <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-[500px] w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5 ${className}`}
    >
        <div className="w-full p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <img
                        aria-label="notify-thumbnail"
                        className="h-20 w-20 "
                        src={info?.thumbnails?.["default"]?.url}
                        alt=""
                    />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-lg font-primary font-bold text-gray-900">
                        {info?.title || "Unknown"}
                    </p>
                    <p className=" text-sm text-gray-500 font-primary">
                        Shared by <span className="font-primary">{info?.sharedBy?.email ?? "Unknown@gmail.com"}</span> at <span className="font-primary">{dayjs(info?.sharedTime ?? Date.now()).format("HH:mm")}</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row  border-gray-200 ">
            <button
                onClick={openNewTab}
                className="w-full  p-4 flex items-center justify-center text-md font-medium  
                bg-youtube-primary text-white font-primary  hover:shadow-inner hover:!text-white hover:grayscale-[20%]">
                Watch
            </button>
            <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent 
                rounded-none rounded-r-lg p-4 flex items-center 
                justify-center text-md  font-medium 
                font-primary
                hover:opacity-[50%]
                "
            >
                Close
            </button>
        </div>
    </div>
}