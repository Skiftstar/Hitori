CREATE TABLE Channels (
    ChannelID INTEGER PRIMARY KEY,
    ChannelName TEXT NOT NULL
);

CREATE TABLE Threads (
    ThreadID INTEGER PRIMARY KEY,
    ChannelID INTEGER,
    ThreadName TEXT NOT NULL,
    FOREIGN KEY(ChannelID) REFERENCES Channels(ChannelID)
);

CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY,
    UserName TEXT NOT NULL,
    DisplayName TEXT NOT NULL,
    Discriminator INTEGER
);

CREATE TABLE Messages (
    MessageID INTEGER PRIMARY KEY,
    UserID INTEGER,
    ThreadID INTEGER,
    Content TEXT,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(UserID) REFERENCES Users(UserID),
    FOREIGN KEY(ThreadID) REFERENCES Threads(ThreadID)
);

CREATE TABLE Media (
    MediaID INTEGER PRIMARY KEY,
    MessageID INTEGER,
    URL TEXT,
    Type TEXT,
    MediaData BLOB,
    FOREIGN KEY(MessageID) REFERENCES Messages(MessageID)
);