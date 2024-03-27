import express from "express";
import { getArchivedServers } from "../../Archiving/archiveDBUtil";
import { SERVER_LIST_DB_NAME } from "../../Archiving/archiveTypes";
const router = express.Router();

router.get("/archive/servers", async (req, res) => {
  const servers = await getArchivedServers(SERVER_LIST_DB_NAME)
  res.json(servers)
})

module.exports = router;