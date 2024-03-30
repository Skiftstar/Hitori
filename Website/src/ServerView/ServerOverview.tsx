import { useEffect, useState } from "react"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { getArchivedServers } from "../data"
import { ArchivedServer } from "./types"

interface ServerOverviewProps {
  displayServer: Function
}

const ServerOverview = ({ displayServer }: ServerOverviewProps) => {
  const [entries, setEntries] = useState<ArchivedServer[]>([])
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  )

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getArchivedServers()
      setEntries(data)
    }

    fetchEntries()
  }, [])

  useEffect(() => {
    const sortedEntries = [...entries].sort((a: any, b: any) => {
      if (sortDirection === "none" || sortField === null) {
        // When unsorted, sort by 'id'
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
      } else {
        // When sorted, sort by the selected field
        if (a[sortField] < b[sortField]) {
          return sortDirection === "asc" ? 1 : -1
        }
        if (a[sortField] > b[sortField]) {
          return sortDirection === "asc" ? -1 : 1
        }
        return 0
      }
    })
    setEntries(sortedEntries)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortDirection])

  const columns = ["id", "icon", "serverName", "created", "archived", "updated"]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? "none"
          : "asc"
      )
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {columns.map((column, index) => (
            <Th
              className="select-none cursor-pointer"
              key={index}
              onClick={() => handleSort(column)}
            >
              {column}
              {sortField === column &&
                (sortDirection === "asc"
                  ? "↑"
                  : sortDirection === "desc"
                  ? "↓"
                  : "")}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody className="text-text-color">
        {entries.map((entry, index) => (
          <Tr
            onClick={() => {
              displayServer(entry)
            }}
            key={index}
            className="hover:bg-secondary-color cursor-pointer"
          >
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
