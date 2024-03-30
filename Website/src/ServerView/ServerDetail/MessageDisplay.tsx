import { useEffect, useRef } from "react"
import { Message, UserMap } from "../types"

interface MessageDisplayProps {
  messages: Message[]
  users: UserMap
}

const MessageDisplay = ({ messages, users }: MessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
  }

  useEffect(scrollToBottom, [messages])

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

          const maxGap = 10 * 60 * 1000 // 10 Minutes

          // We need this check to determine if this is the first message in a sequence of messages from the same user
          const nextMessageConnecting =
            nextMessage?.userID === message.userID &&
            nextMessageTime.getTime() - currMessageTime.getTime() <= maxGap

          const connectingMessage =
            prevMessage?.userID === message.userID &&
            currMessageTime.getTime() - prevMessageTime.getTime() <= maxGap

          return (
            <div
              key={message.id}
              className={`flex flex-row p-2 ${
                connectingMessage && "pt-0 pb-0 pl-12"
              } ${
                nextMessageConnecting && "pb-0"
              } items-start gap-2 hover:bg-secondary-color/20`}
            >
              {!connectingMessage && (
                <img
                  src={user?.avatarURL}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div className="flex flex-col">
                <div className="text-gray-500 flex flex-row gap-2 items-center">
                  {!connectingMessage && (
                    <div className="text-gray-500 flex flex-row gap-2 items-center">
                      <div className="text-white">{user?.displayName}</div>
                    </div>
                  )}
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
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageDisplay
