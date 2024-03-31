import { Thread as ThreadType } from "../types"

interface ChannelProps {
  thread: ThreadType
  setSelectedChannel: Function
  selected: boolean
  className?: string
}

const Thread = ({
  thread,
  setSelectedChannel,
  selected,
  className,
}: ChannelProps) => {
  return (
    <div
      onClick={() => setSelectedChannel(thread)}
      className={`${
        selected ? "bg-secondary-color" : ""
      } pb-[2px] mb-[2px] hover:bg-secondary-color/50 transition ease-in-out duration-200 px-1 rounded cursor-pointer`}
    >
      {`∠ ${thread.name}`}
    </div>
  )
}
export default Thread
