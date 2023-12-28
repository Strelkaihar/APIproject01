const { defineConfig } = require("cypress");
const oracledb = require("oracledb");

module.exports = defineConfig({
  env: {
    baseUrl: "https://tech-global-training.com/students",
    'oracleDb': {
      'user': 'techglobaldev',
      'password': '$techglobaldev123!',
      'connectionString': 'techglobal.cup7q3kvh5as.us-east-2.rds.amazonaws.com:1521/TGDEVQA'
    }
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      //Define a suctom task for database queries
      on('task', {
        async runQuery(query) {
          let connection;
          try {
            // Estabilish connection wo the Oracle database
            connection = await oracledb.getConnection(config.env.oracleDb);

            //Execute the query
            const result = await connection.execute(query);
            return result.rows
          } catch (err) {
            throw new Error(err);
          } finally {
            if(connection) {
              //Ensure the connection is closed after execution
              await connection.close();
            }
          }
        }
      })
    },
  },
});
