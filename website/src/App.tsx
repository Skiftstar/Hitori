import { ChakraProvider } from "@chakra-ui/react"
import "./App.css"

function App() {
  return (
    <ChakraProvider>
      <h1 className="text-3xl font-bold underline text-red-600">
        Simple React Typescript Tailwind Sample
      </h1>
    </ChakraProvider>
  )
}

export default App
