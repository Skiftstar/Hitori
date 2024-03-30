import express from "express"
import {
  getArchivedServers,
  getChannelMessages,
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
  const serverId = req.params.id

  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)

  const server = servers.find((server) => `${server.id}` === `${serverId}`)

  const dbName = getServerDBName(server)

  const serverCategoryChannels = await getServerCategoryChannels(dbName)

  res.json(serverCategoryChannels)
})

router.get("/archive/servers/:id/users", async (req, res) => {
  const serverId = req.params.id

  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)

  const server = servers.find((server) => `${server.id}` === `${serverId}`)

  const dbName = getServerDBName(server)

  const serverCategoryChannels = await getServerUsers(dbName)

  res.json(serverCategoryChannels)
})

router.get("/archive/servers/:id/channels/:channelId", async (req, res) => {
  const serverId = req.params.id
  const channelId = req.params.channelId

  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)

  const server = servers.find((server) => `${server.id}` === `${serverId}`)

  const dbName = getServerDBName(server)

  const messages = await getChannelMessages(dbName, channelId)

  res.json(messages)
})

module.exports = router
