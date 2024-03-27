import { ReactNode, useState } from "react"
import { Page } from "../types"

interface SidebarWrapperProps {
  pages: Page[]
  setPage: Function
  children?: ReactNode
}

const SidebarWrapper = ({ pages, setPage, children }: SidebarWrapperProps) => {
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
          {pages.map((page, index) => (
            <div
              key={page.name}
              onClick={() => {
                setPage(page)
              }}
              className={`hover:px-1 cursor-pointer flex gap-4 justify-start w-full py-2 rounded hover:bg-secondary-color transition-all ease-in-out duration-300`}
            >
              {page.icon}
              <span>{page.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-12 top-0 h-full w-[calc(100%-3rem)]">
        {children}
      </div>
    </div>
  )
}

export default SidebarWrapper
