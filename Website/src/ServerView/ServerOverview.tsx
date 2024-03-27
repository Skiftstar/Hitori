import { useEffect, useState } from "react"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { getArchivedServers } from "../data"
import { ArchivedServer } from "./types"

const ServerOverview = () => {
  const [entries, setEntries] = useState<ArchivedServer[]>([])

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getArchivedServers() // Replace this with your function to fetch entries
      setEntries(data)
    }

    fetchEntries()
  }, [])

  const columns = ["ID", "Icon", "Name", "Created", "Archived", "Updated"]

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {columns.map((column, index) => (
            <Th key={index}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody className="text-text-color">
        {entries.map((entry, index) => (
          <Tr key={index}>
            <Td>{entry.id}</Td>
            <Td></Td>
            <Td>{entry.serverName}</Td>
            <Td>{entry.created}</Td>
            <Td>{entry.archived}</Td>
            <Td>{entry.updated}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default ServerOverview
