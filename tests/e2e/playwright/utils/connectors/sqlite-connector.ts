import { Connector } from ".";

export class SqliteConnector extends Connector {
  private deleteSqliteFiles() {
    const { exec } = require("child_process");
    const a = exec(
      'docker ps -aqf "name=docker-compose-lupa-api"',
      (err: string, stdout: string) => {
        if (err) {
          throw err;
        } else {
          console.log(stdout);
          const command = "docker exec " + stdout + "rm -rf embedded_spans.db";

          console.log(command);

          exec(command, (err: string) => {
            if (err) {
              throw err;
            }
          });
        }
      }
    );
  }

  async clean(): Promise<void> {
    try {
      const a = await this.deleteSqliteFiles();
    } catch (err) {
      throw new Error(`Connector failed to clean Sqlite: ${err}`);
    }
  }
}

new SqliteConnector().clean();
