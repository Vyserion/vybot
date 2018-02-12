-- Create required leaderboard tables
CREATE TABLE IF NOT EXISTS LEADERBOARDS (
    ID      INT PRIMARY KEY NOT NULL,
    NAME    TEXT            NOT NULL
);

CREATE TABLE IF NOT EXISTS LEADERBOARD_COLUMNS (
	ID					INT PRIMARY KEY	NOT NULL,
    LEADERBOARD_ID      INT     		NOT NULL    REFERENCES LEADERBOARDS(ID),
    NAME                TEXT    		NOT NULL,
    TYPE                TEXT    		NOT NULL
);

CREATE TABLE IF NOT EXISTS LEADERBOARD_ROWS (
	ID					INT PRIMARY KEY	NOT NULL,
    LEADERBOARD_ROW_ID  INT    			NOT NULL    REFERENCES LEADERBOARD_COLUMNS(ID),
    NAME                TEXT    		NOT NULL,
    COLUMN_VALUE        TEXT    		NOT NULL
); 