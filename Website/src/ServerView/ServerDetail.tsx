import { useEffect, useState } from "react"
import { ArchivedServer, Channel, ServerCategoryChannelResponse } from "./types"
import { getServerCategoryChannels } from "../data"
import ChannelSidebar from "./ServerDetail/ChannelSidebar"

interface ServerDetailProps {
  server: ArchivedServer
}

const ServerDetail = ({ server }: ServerDetailProps) => {
  const [data, setData] = useState<ServerCategoryChannelResponse | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getServerCategoryChannels(server.id)
      setData(data)
    }

    fetchEntries()
  }, [server])

  return (
    <div className="h-full">
      {data && (
        <div className="h-full">
          <ChannelSidebar
            channelCategories={data}
            serverName={server.serverName}
            setSelectedChannel={setSelectedChannel}
            selectedChannel={selectedChannel}
          />
        </div>
      )}
    </div>
  )
}

export default ServerDetail
