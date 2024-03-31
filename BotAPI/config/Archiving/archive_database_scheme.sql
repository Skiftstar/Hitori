CREATE TABLE Categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Channels (
    id TEXT PRIMARY KEY,
    categoryID TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY(categoryID) REFERENCES Categories(id)
);

CREATE TABLE Threads (
    id TEXT PRIMARY KEY,
    channelID TEXT,
    name TEXT NOT NULL,
    FOREIGN KEY(channelID) REFERENCES Channels(id)
);

CREATE TABLE Users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    displayName TEXT NOT NULL,
    discriminator INTEGER,
    avatarURL TEXT,
    avatarData BLOB,
    UNIQUE(username, discriminator)
);

CREATE TABLE Messages (
    id TEXT PRIMARY KEY,
    userID TEXT,
    channelID TEXT,
    threadID TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    hasMedia BOOLEAN DEFAULT FALSE,
    type TEXT,
    isSystemMessage BOOLEAN DEFAULT FALSE,
    isPinned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(userID) REFERENCES Users(id),
    FOREIGN KEY(channelID) REFERENCES Channels(id),
    FOREIGN KEY(threadID) REFERENCES Threads(id)
);

CREATE TABLE Media (
    id TEXT PRIMARY KEY,
    messageID TEXT,
    url TEXT,
    type TEXT,
    data BLOB,
    FOREIGN KEY(messageID) REFERENCES Messages(id)
);