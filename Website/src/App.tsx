import { ChakraProvider } from "@chakra-ui/react"
import "./App.css"
import SidebarWrapper from "./components/SidebarWrapper"
import { useState } from "react"
import { Page } from "./types"
import ServerOverview from "./ServerView/ServerOverview"
import ServerDetail from "./ServerView/ServerDetail"
import { ArchivedServer } from "./ServerView/types"
import { Global, css } from "@emotion/react"

function App() {
  const pages: Page[] = [
    {
      name: "Home",
      icon: <HomeIcon />,
      content: (
        <div>
          <span className="text-text-color">Home</span>
        </div>
      ),
    },
    {
      name: "Bot",
      icon: <BotIcon />,
      content: (
        <div>
          <span className="text-text-color">Bot</span>
        </div>
      ),
    },
    {
      name: "Servers",
      icon: <ServerArchiveIcon />,
      content: (
        <div>
          <ServerOverview
            displayServer={(server: ArchivedServer) => {
              setCurrentPage({
                name: server.id,
                icon: <ServerArchiveIcon />,
                content: <ServerDetail server={server} />,
              })
            }}
          />
        </div>
      ),
    },
  ]

  const [currentPage, setCurrentPage] = useState<Page>(pages[0])

  return (
    <ChakraProvider>
      <Global
        styles={css`
          html {
            background-color: #201e2b;
          }
        `}
      />
      <body className="absolute h-[100%] w-full bg-bg-color text-text-color text-normal">
        <SidebarWrapper pages={pages} setPage={setCurrentPage}>
          {currentPage.content}
        </SidebarWrapper>
      </body>
    </ChakraProvider>
  )
}

export default App

const HomeIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      style={{ minWidth: "24px", minHeight: "24px" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-home"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

const BotIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ minWidth: "24px", minHeight: "24px" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-bot"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}

const ServerArchiveIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ minWidth: "24px", minHeight: "24px" }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-archive"
    >
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  )
}
