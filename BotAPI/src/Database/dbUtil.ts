import * as sqlite3 from "sqlite3"
import { open } from "sqlite"
import * as fs from "fs"
import path from "path"

export const createDatabase = async (dbName: string, schemaPath: string) => {
  if (doesDatabaseExist(dbName)) {
    console.log("Database already exists")
    return
  }

  // Ensure the directory exists
  const dir = path.dirname(dbName)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = await open({
    filename: dbName,
    driver: sqlite3.Database,
  })

  const schema = fs.readFileSync(schemaPath, "utf-8")
  console.log(schema)
  await db.exec(schema)

  console.log("Database created successfully")
}

export const doesDatabaseExist = (dbName: string) => {
  return fs.existsSync(dbName)
}
