import { Message, UserMap } from "../types"

export const filterMessages = (
  messages: Message[],
  users: UserMap,
  search: string
): Message[] => {
  let searchTerms = search.split(" ")

  //Get all from:"user" searches, needed for users with spaces in their name
  const fromSearchRegex = /from:"(.*?)"/g
  let match
  const usersToFilter: string[] = []

  while ((match = fromSearchRegex.exec(search)) !== null) {
    usersToFilter.push(match[1].toLowerCase())
  }

  // Remove from:"user" searches
  search = search.replace(fromSearchRegex, "")
  searchTerms = search.split(" ")

  // Get all from:user searches
  const fromSearch = searchTerms.filter((term) => term.startsWith("from:"))
  fromSearch.forEach((term) => {
    const user = term.slice(5).toLowerCase()
    if (!usersToFilter.includes(user)) {
      usersToFilter.push(user)
    }
  })

  //Get all normal word searches
  const normalWordSearch = searchTerms.filter(
    (term) => !term.startsWith("from:") && !term.includes('from:"')
  )

  const messagesFromUsers = messages.filter((message) => {
    const user = users[message.userID]
    return (
      usersToFilter.includes(user.username.toLowerCase()) ||
      usersToFilter.includes(user.displayName.toLowerCase()) ||
      usersToFilter.includes(message.userID)
    )
  })

  const filteredMessages = messagesFromUsers.filter((message) => {
    return normalWordSearch.every((term) =>
      message.content.toLowerCase().includes(term.toLowerCase())
    )
  })

  return filteredMessages
}
