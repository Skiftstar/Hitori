import express from "express"
import {
  getArchivedServers,
  getServerCategoryChannels,
} from "../../Archiving/archiveDBUtil"
import { SERVER_ARCHIVE_FOLDER_NAME, SERVER_LIST_DB_NAME } from "../../Archiving/archiveTypes"
const router = express.Router()

router.get("/archive/servers", async (req, res) => {
  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)
  res.json(servers)
})

router.get("/archive/servers/:id", async (req, res) => {
  const serverId = req.params.id

  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)

  const server = servers.find((server) => `${server.id}` === `${serverId}`)

  const dbName = `${SERVER_ARCHIVE_FOLDER_NAME}/${server.serverName}-${server.id}.db`

  console.log(dbName)

  const serverCategoryChannels = await getServerCategoryChannels(dbName)

  res.json(serverCategoryChannels)
})

module.exports = router
