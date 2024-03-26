import { ChakraProvider } from "@chakra-ui/react"
import "./App.css"
import SidebarWrapper from "./components/SidebarWrapper"

function App() {
  return (
    <ChakraProvider>
      <body className="absolute h-[100%] w-full bg-bg-color">
        <SidebarWrapper>
          <div>
            <span className="text-text-color">test</span>
          </div>
        </SidebarWrapper>
      </body>
    </ChakraProvider>
  )
}

export default App
