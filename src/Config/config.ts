import { readFileSync } from "fs"

const config = JSON.parse(readFileSync("./config/config.json", "utf-8"))

export const getConfigValue = (key: string) => {
  return config[key]
}
