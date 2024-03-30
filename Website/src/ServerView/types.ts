export type ArchivedServer = {
  id: string
  serverName: string
  serverIconURL: string
  serverIconData: any
  created: string
  archived: string
  updated: string
}

export type Channel = {
  id: string
  name: string
  categoryID: string
}

export type Category = {
    id: string
    name: string
    channels: Channel[]
}

export type ServerCategoryChannelResponse = {
    categories: Category[]
    channelsWithoutCategory: Channel[]
}
