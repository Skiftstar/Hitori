CREATE TABLE Categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Channels (
    id INTEGER PRIMARY KEY,
    categoryID INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY(categoryID) REFERENCES Categories(id)
);

CREATE TABLE Threads (
    id INTEGER PRIMARY KEY,
    channelID INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY(channelID) REFERENCES Channels(id)
);

CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    displayName TEXT NOT NULL,
    discriminator INTEGER
);

CREATE TABLE Messages (
    id INTEGER PRIMARY KEY,
    userID INTEGER,
    threadID INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userID) REFERENCES Users(id),
    FOREIGN KEY(threadID) REFERENCES Threads(id)
);

CREATE TABLE Media (
    id INTEGER PRIMARY KEY,
    messageID INTEGER,
    url TEXT,
    type TEXT,
    data BLOB,
    FOREIGN KEY(messageID) REFERENCES Messages(id)
);