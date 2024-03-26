import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  useDisclosure,
} from "@chakra-ui/react"

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box as="nav">
      <Button onClick={onOpen}>Menu</Button>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader className="bg-bg-color text-text-color border-b-text-color border-b-2">
              <span className="text-2xl px-2">Menu</span>
            </DrawerHeader>

            <DrawerBody
              className="bg-bg-color text-text-color text-xl"
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <div className="transition ease-in-out duration-300 hover:bg-highlight-color hover:text-black px-2 rounded cursor-pointer">
                Home
              </div>
              <div className="transition ease-in-out duration-300 hover:bg-highlight-color hover:text-black px-2 cursor-pointer rounded">
                Bot
              </div>
              <div className="transition ease-in-out duration-300 hover:bg-highlight-color hover:text-black px-2 cursor-pointer rounded">
                Server Archive
              </div>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}

export default Navbar
