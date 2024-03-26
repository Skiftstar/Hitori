import { ChakraProvider } from "@chakra-ui/react"
import "./App.css"
import Navbar from "./components/Navbar"
import SidebarExp from "./components/SidebarExp"

function App() {
  return (
    <ChakraProvider>
      <body className="absolute h-[100%] w-full bg-bg-color">
        {/* <h1 className="text-3xl font-bold underline text-red-600">
          Simple React Typescript Tailwind Sample
        </h1>
        <Navbar /> */}
        <SidebarExp/>
      </body>
    </ChakraProvider>
  )
}

export default App
