import { Channel as ChannelType, ServerCategoryChannelResponse } from "../types"
import Channel from "./Channel"

interface ChannelSidebarProps {
  serverName: string
  channelCategories: ServerCategoryChannelResponse
  setSelectedChannel: Function
  selectedChannel: ChannelType | null
  className?: string
}

const ChannelSidebar = ({
  serverName,
  channelCategories,
  setSelectedChannel,
  selectedChannel,
  className,
}: ChannelSidebarProps) => {
  return (
    <div
      className={`h-full overflow-y-scroll border-r-2 border-secondary-color w-fit pr-2 ${
        className ?? ""
      }`}
    >
      <div className="p-2">
        <div className="text-xl pb-4">{serverName}</div>

        {channelCategories.channelsWithoutCategory.length > 0 && (
          <div className="pb-4">
            {channelCategories.channelsWithoutCategory.map((channel) => (
              <Channel
                key={channel.id}
                channel={channel}
                setSelectedChannel={setSelectedChannel}
                selected={channel.id === selectedChannel?.id}
              />
            ))}
          </div>
        )}

        {channelCategories.categories.map((category) => (
          <div key={category.id} className="pb-4">
            <div className="text-category-color">{category.name}</div>
            {category.channels.map((channel) => (
              <Channel
                key={channel.id}
                channel={channel}
                setSelectedChannel={setSelectedChannel}
                selected={channel.id === selectedChannel?.id}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChannelSidebar
