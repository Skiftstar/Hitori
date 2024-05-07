import { Message, UserMap } from "../types"

const searchTerms = ["from:", "before:", "after:", "has:", 'from:"']

export const filterMessages = (
  messages: Message[],
  users: UserMap,
  search: string
): Message[] => {
  search = search.toLowerCase()
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

  // Get first after: search
  const afterSearch = searchTerms.filter((term) => term.startsWith("after:"))
  const afterDate = afterSearch.length > 0 ? afterSearch[0].slice(6) : ""

  // Get first before: search
  const beforeSearch = searchTerms.filter((term) => term.startsWith("before:"))
  const beforeDate = beforeSearch.length > 0 ? beforeSearch[0].slice(7) : ""

  // Get all has: search
  const hasSearch = searchTerms.filter((term) => term.startsWith("has:"))
  const hasTerms = hasSearch
    .filter((term) => term.length > 4)
    .map((term) => term.slice(4))

  //Get all normal word searches
  const normalWordSearch = searchTerms.filter(
    (term) => !searchTerms.some((searchTerm) => searchTerm === term)
  )

  let filteredMessages = messages

  // User filtering
  filteredMessages =
    usersToFilter.length > 0
      ? messages.filter((message) => {
          const user = users[message.userID]
          return (
            usersToFilter.includes(user.username.toLowerCase()) ||
            usersToFilter.includes(user.displayName.toLowerCase()) ||
            usersToFilter.includes(message.userID)
          )
        })
      : filteredMessages

  // After date filtering
  filteredMessages =
    afterDate.length > 0
      ? filteredMessages.filter((message) => {
          return new Date(message.timestamp) > new Date(afterDate)
        })
      : filteredMessages

  // Before date filtering
  filteredMessages =
    beforeDate.length > 0
      ? filteredMessages.filter((message) => {
          return new Date(message.timestamp) < new Date(beforeDate)
        })
      : filteredMessages

  // Has term filtering
  filteredMessages =
    hasTerms.length > 0
      ? filteredMessages.filter((message) => {
          return hasTerms.every(
            (term) =>
              message.hasMedia &&
              message.media.some((media) =>
                media.type.toLowerCase().includes(term)
              )
          )
        })
      : filteredMessages

  filteredMessages = filteredMessages.filter((message) => {
    return normalWordSearch.every((term) =>
      message.content.toLowerCase().includes(term.toLowerCase())
    )
  })

  return filteredMessages
}
