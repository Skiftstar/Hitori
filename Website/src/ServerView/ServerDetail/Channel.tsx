import { Channel as ChannelType } from "../types"

interface ChannelProps {
  channel: ChannelType
  setSelectedChannel: Function
  selected: boolean
  className?: string
}

const Channel = ({
  channel,
  setSelectedChannel,
  selected,
  className,
}: ChannelProps) => {
  return (
    <div
      onClick={() => setSelectedChannel(channel)}
      className={`${
        selected ? "bg-secondary-color" : ""
      } pb-[2px] mb-[2px] hover:bg-secondary-color/50 transition ease-in-out duration-200 px-1 rounded cursor-pointer`}
    >
      {`# ${channel.name}`}
    </div>
  )
}
export default Channel
