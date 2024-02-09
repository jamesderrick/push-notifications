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
        acknowledged BIT NOT NULL DEFAULT 0
    );

    INSERT INTO nudges (requestor_id, recipient_id) VALUES (1,2);
    INSERT INTO nudges (requestor_id, recipient_id) VALUES (1,3);

    CREATE TABLE nudge_contact (
        nudge_id INTEGER NOT NULL,
        contact_id INTEGER NOT NULL
    );

    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (1, 5);
    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (1, 6);
    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (1, 7);
    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (1, 8);
    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (2, 9);
    INSERT INTO nudge_contact (nudge_id, contact_id) VALUES (2, 10);

    CREATE TABLE contacts (
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL
    );

    INSERT INTO contacts (first_name, last_name, email) VALUES ('Stan','Greaves','stan.greaves@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Jim','Collins','jim.collins@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Bob','Santiago','bob.santiago@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Clare','Sparrow','clare.sparrow@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Greta','Shaw','greta.shaw@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Chris','Redfield','chris.redfield@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('John','Jones','john.jones@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Kim','Yung','kim.yung@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Harry','Hall','harry.hill@test.com');
    INSERT INTO contacts (first_name, last_name, email) VALUES ('Susan','Leadbetter','susan.leadbetter@test.com');

    `);
}

module.exports = createDbConnection();