import { Thread } from "../types"

interface ThreadBannerProps {
  thread: Thread
  setChannel: (channel: Thread | null) => void
}

const ThreadBanner = ({ thread, setChannel }: ThreadBannerProps) => {
  return (
    <div
      onClick={() => {
        setChannel(thread)
      }}
      className="flex flex-row gap-2 items-center mt-2 bg-gray-800 p-2 rounded cursor-pointer"
    >
      <div className="text-gray-500 flex flex-row gap-2 items-center">
        <div className="text-white">
          <span className="text-text-color">{`Thread: `}</span>
          {thread.name}
        </div>
      </div>
    </div>
  )
}

export default ThreadBanner
