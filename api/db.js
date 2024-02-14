const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const filepath = './db/notifications.db';

function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath)
    } else {
        const db = new sqlite3.Database(filepath, (error) => {
            if(error) {
                return console.error(error.message)
            }
            createTables(db)
        });
        console.log("Connection with SQLite has been established");
        return db;
    }
}

function createTables(db) {
    db.exec(`
    CREATE TABLE subscriptions (
        subscription_id TEXT PRIMARY KEY,
        endpoint TEXT NOT NULL,
        expiration_time TEXT,
        key_1 TEXT NOT NULL,
        key_2 TEXT NOT NULL,
        contact_id INTEGER NOT NULL,
        agent TEXT NOT NULL
    );

    CREATE TABLE nudges (
        nudge_id INTEGER PRIMARY KEY AUTOINCREMENT,
        requestor_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        received BIT NOT NULL DEFAULT 0,
        received_timestamp DATETIME NULL,
        acknowledged BIT NOT NULL DEFAULT 0,
        acknowledged_timestamp DATETIME NULL
    );

    CREATE TABLE nudge_contact (
        nudge_id INTEGER NOT NULL,
        contact_id INTEGER NOT NULL
    );

    CREATE TABLE contacts (
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        type TEXT NOT NULL
    );

    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Stan','Greaves','stan.greaves@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Jim','Collins','jim.collins@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Bob','Santiago','bob.santiago@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Clare','Sparrow','clare.sparrow@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Greta','Shaw','greta.shaw@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Chris','Redfield','chris.redfield@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('John','Jones','john.jones@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Kim','Yung','kim.yung@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Harry','Hall','harry.hill@test.com','contact');
    INSERT INTO contacts (first_name, last_name, email, type) VALUES ('Susan','Leadbetter','susan.leadbetter@test.com','contact');

    `);
}

module.exports = createDbConnection();