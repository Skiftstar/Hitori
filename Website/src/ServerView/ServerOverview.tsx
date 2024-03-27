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
      console.log(data)
    }
    console.log("fetching entries")

    fetchEntries()
  }, [])

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Column 1</Th>
          <Th>Column 2</Th>
          {/* Add more <Th> elements here for additional columns */}
        </Tr>
      </Thead>
      <Tbody className="text-text-color">
        {entries.map((entry, index) => (
          <Tr key={index}>
            <Td>{entry.serverName}</Td>
            <Td>{entry.id}</Td>
            {/* Add more <Td> elements here for additional columns */}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default ServerOverview
