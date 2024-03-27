CREATE TABLE Servers (
    id INTEGER PRIMARY KEY,
    serverName TEXT NOT NULL,
    serverIconURL TEXT,
    serverIconData BLOB,
    UNIQUE(id)
);