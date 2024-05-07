import express from "express"
import {
  getArchivedServers,
  getChannelMessages,
  getMessageMedia,
  getServerCategoryChannels,
  getServerDBName,
  getServerUsers,
} from "../../Archiving/archiveDBUtil"
import {
  SERVER_ARCHIVE_FOLDER_NAME,
  SERVER_LIST_DB_NAME,
} from "../../Archiving/archiveTypes"
const router = express.Router()

router.get("/archive/servers", async (req, res) => {
  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)
  res.json(servers)
})

router.get("/archive/servers/:id", async (req, res) => {
  const dbName = await getDbNameFromServerId(req.params.id)

  const serverCategoryChannels = await getServerCategoryChannels(dbName)

  res.json(serverCategoryChannels)
})

router.get("/archive/servers/:id/users", async (req, res) => {
  const dbName = await getDbNameFromServerId(req.params.id)

  const serverCategoryChannels = await getServerUsers(dbName)

  res.json(serverCategoryChannels)
})

router.get("/archive/servers/:id/channels/:channelId", async (req, res) => {
  const channelId = req.params.channelId

  const dbName = await getDbNameFromServerId(req.params.id)

  const messages = await getChannelMessages(dbName, channelId, false)

  res.json(messages)
})

router.get("/archive/servers/:id/media/:messageId", async (req, res) => {
  const serverId = req.params.id
  const messageId = req.params.messageId

  const dbName = await getDbNameFromServerId(req.params.id)

  const media = await getMessageMedia(dbName, messageId)

  console.log(dbName, media)

  res.json(media)
})

router.get("/archive/servers/:id/threads/:threadId", async (req, res) => {
  const serverId = req.params.id
  const threadId = req.params.threadId

  const dbName = await getDbNameFromServerId(req.params.id)

  const messages = await getChannelMessages(dbName, threadId, true)

  res.json(messages)
})

const getDbNameFromServerId = async (serverId: string) => {
  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)

  const server = servers.find((server) => `${server.id}` === `${serverId}`)

  return getServerDBName(server)
}

module.exports = router
