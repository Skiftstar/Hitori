import { ReactNode, useState } from "react"

interface SidebarWrapperProps {
  children?: ReactNode
}

const SidebarWrapper = ({ children }: SidebarWrapperProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute w-full h-full">
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        id="sidebar"
        className={`${
          open ? "w-32" : "w-12"
        } bg-bg-color absolute border-r-2 border-r-secondary-color h-full transition-width ease-in-out duration-300 overflow-hidden px-2.5 z-20`}
      >
        <div className="text-text-color flex items-center justify-center py-12 flex-col gap-2 w-full">
          <div
            className={`hover:px-1 cursor-pointer flex gap-4 justify-start w-full py-2 rounded hover:bg-secondary-color transition-all ease-in-out duration-300`}
          >
            <HomeIcon />
            <span>Home</span>
          </div>

          <div
            className={`hover:px-1 cursor-pointer flex gap-4 justify-start w-full py-2 rounded hover:bg-secondary-color transition-all ease-in-out duration-300`}
          >
            <BotIcon />
            <span>Bot</span>
          </div>

          <div
            className={`hover:px-1 cursor-pointer flex gap-4 justify-start w-full py-2 rounded hover:bg-secondary-color transition-all ease-in-out duration-300`}
          >
            <ServerArchiveIcon />
            <span>Servers</span>
          </div>
        </div>
      </div>

      <div className="absolute left-12 top-0 h-full w-[calc(100%-3rem)]">
        {children}
      </div>
    </div>
  )
}

export default SidebarWrapper

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
