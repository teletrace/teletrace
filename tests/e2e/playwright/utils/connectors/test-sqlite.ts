// Require or import the dependencies
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

// Read the SQL file
const dataSql = fs
  .readFileSync(
    "../../../../../lupa-otelcol/exporter/sqliteexporter/migrations/00_init_schema.up.sql"
  )
  .toString();

// Setup the database connection
let db = new sqlite3.Database("embedded_spans.db", (err: any) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database.");
});

console.log(dataSql);

db.run("PRAGMA foreign_keys=OFF;");
db.run("BEGIN TRANSACTION;");

db.run(dataSql, (err: any) => {
  if (err) throw err;
});

db.run("COMMIT;");

// // Convert the SQL string to array so that you can run them one at a time.
// // You can split the strings using the query delimiter i.e. `;` in // my case I used `);` because some data in the queries had `;`.
// const dataArr = dataSql.toString().split(");");

// // db.serialize ensures that your queries are one after the other depending on which one came first in your `dataArr`
// db.serialize(() => {
//   // db.run runs your SQL query against the DB
//   db.run("PRAGMA foreign_keys=OFF;");
//   db.run("BEGIN TRANSACTION;");
//   // Loop through the `dataArr` and db.run each query
//   dataArr.forEach((query: string) => {
//     if (query) {
//       // Add the delimiter back to each query before you run them
//       // In my case the it was `);`
//       query += ");";
//       db.run(query, (err: any) => {
//         if (err) throw err;
//       });
//     }
//   });
//   db.run("COMMIT;");
// });

// Close the DB connection
db.close((err: any) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Closed the database connection.");
});
