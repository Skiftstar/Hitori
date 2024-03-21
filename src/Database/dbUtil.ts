import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as fs from 'fs';

export const createDatabase = async (dbName: string, schemaPath: string) => {
    if (doesDatabaseExist(dbName)) {
        console.log("Database already exists");
        return;
    }

    const db = await open({
        filename: dbName,
        driver: sqlite3.Database
    });

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await db.exec(schema);

    console.log("Database created successfully");
}

const doesDatabaseExist = (dbName: string) => {
    return fs.existsSync(dbName);
}

// createDatabase('discord_archive.db', './archive_database_scheme.sql').catch(console.error);