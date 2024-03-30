import { useEffect, useState } from "react"
import {
  ArchivedServer,
  Channel,
  Message,
  ServerCategoryChannelResponse,
  UserMap,
} from "./types"
import {
  getChannelMessages,
  getServerCategoryChannels,
  getServerUsers,
} from "../data"
import ChannelSidebar from "./ServerDetail/ChannelSidebar"
import MessageDisplay from "./ServerDetail/MessageDisplay"
import SearchBar from "./ServerDetail/SearchBar"
import { filterMessages } from "./ServerDetail/MessageSearch"

interface ServerDetailProps {
  server: ArchivedServer
}

const ServerDetail = ({ server }: ServerDetailProps) => {
  const [data, setData] = useState<ServerCategoryChannelResponse | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<UserMap>({})
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchEntries = async () => {
      const messages = await getChannelMessages(
        server.id,
        selectedChannel?.id || ""
      )
      setMessages(messages)
      setDisplayedMessages(messages)
      setSearch("")
    }

    fetchEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel])

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getServerCategoryChannels(server.id)
      const users = await getServerUsers(server.id)

      setUsers(users)
      setData(data)
    }

    fetchEntries()
  }, [server])

  useEffect(() => {
    if (search === "") {
      setDisplayedMessages(messages)
      return
    }

    let filteredMessages: Message[] = filterMessages(messages, users, search)

    setDisplayedMessages(filteredMessages)
  }, [search, messages, users])

  return (
    <div className="h-full">
      {data && (
        <div className="h-full flex flex-row">
          <ChannelSidebar
            className="flex-shrink-0"
            channelCategories={data}
            serverName={server.serverName}
            setSelectedChannel={setSelectedChannel}
            selectedChannel={selectedChannel}
          />
          <div className="w-full flex-grow">
            <MessageDisplay messages={displayedMessages} users={users} />
            <SearchBar setSearch={setSearch} search={search} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerDetail
