import { useEffect, useRef } from "react"
import { Message, Thread, User, UserMap } from "../types"
import ThreadBanner from "./ThreadBanner"

interface MessageDisplayProps {
  messages: Message[]
  users: UserMap
  threads: Thread[]
  setChannel: (channel: Thread | null) => void
}

const MessageDisplay = ({
  messages,
  users,
  threads,
  setChannel,
}: MessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
  }

  const maxGap = 10 * 60 * 1000 // 10 Minutes

  useEffect(scrollToBottom, [messages])

  const systemMessageInfo = (message: Message, user: User | undefined) => {
    if (message.type === "6") {
      return `${user?.displayName} pinned a message`
    } else if (message.type === "4") {
      return `${user?.displayName} changed the channel name to`
    } else if (message.type === "12") {
      return `${user?.displayName} added a Channel to the follow list`
    } else if (message.type === "7") {
      return `${user?.displayName} joined the Server`
    } else if (message.type === "18") {
      return `${user?.displayName} created Thread`
    }
  }

  return (
    <div className="flex-1 h-[calc(100%-4rem)] overflow-y-auto pt-2 mb-2 w-full">
      <div className="flex flex-col h-full w-full">
        {messages.map((message, index) => {
          const user = users[message.userID]
          const prevMessage = index > 0 ? messages[index - 1] : null
          const nextMessage =
            index < messages.length - 1 ? messages[index + 1] : null

          const prevMessageTime = new Date(prevMessage?.timestamp || 0)
          const nextMessageTime = new Date(nextMessage?.timestamp || 0)
          const currMessageTime = new Date(message.timestamp)

          const prevMessageDate = new Date(
            prevMessage?.timestamp || 0
          ).toDateString()
          const currMessageDate = new Date(message.timestamp).toDateString()
          const isNewDate = prevMessageDate !== currMessageDate

          // We need this check to determine if this is the first message in a sequence of messages from the same user
          const nextMessageConnecting =
            nextMessage?.userID === message.userID &&
            !nextMessage.isSystemMessage &&
            nextMessageTime.getTime() - currMessageTime.getTime() <= maxGap

          const connectingMessage =
            prevMessage?.userID === message.userID &&
            !prevMessage.isSystemMessage &&
            currMessageTime.getTime() - prevMessageTime.getTime() <= maxGap

          // Since a thread will have the ID of the message that started it
          // We can check if the message started a thread by doing a simple ID match
          const thread = threads.find((thread) => thread.id === message.id)

          return (
            <>
              {isNewDate && (
                <div className="date-header flex items-center mx-2">
                  <hr className="flex-grow border-secondary-color" />
                  <div className="mx-2 text-center text-category-color">
                    {new Date(message.timestamp).toLocaleDateString(undefined, {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <hr className="flex-grow border-secondary-color" />
                </div>
              )}
              <div
                key={message.id}
                className={`flex flex-row p-2 mt-2 ${
                  connectingMessage && "!pt-0 !mt-0 !pb-0 !pl-12"
                } ${
                  nextMessageConnecting && "!pb-0"
                } items-start gap-2 hover:bg-secondary-color/20`}
              >
                {!connectingMessage && !message.isSystemMessage && (
                  <img
                    src={user?.avatarURL}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div className="flex flex-col max-w-[calc(100%-3rem)]">
                  <div className="text-gray-500 flex flex-row gap-2 items-center">
                    {!connectingMessage && !message.isSystemMessage && (
                      <div className="text-gray-500 flex flex-row gap-2 items-center">
                        <div className="text-white">{user?.displayName}</div>
                      </div>
                    )}
                    {message.isSystemMessage ? (
                      <div className="text-white">
                        {systemMessageInfo(message, user)}
                      </div>
                    ) : null}
                    {!connectingMessage && (
                      <div className="text-small">
                        {new Date(message.timestamp).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        ) +
                          " " +
                          new Date(message.timestamp).toLocaleTimeString(
                            undefined,
                            { hour: "2-digit", minute: "2-digit", hour12: true }
                          )}
                      </div>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {thread && (
                    <ThreadBanner thread={thread} setChannel={setChannel} />
                  )}
                </div>
              </div>
            </>
          )
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageDisplay
