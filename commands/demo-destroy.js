import { spawn } from "child_process";

/**
 * @summary run the docker command to destroy all images and volumes
 * @returns {Promise<Boolean>} true if success
 */
export default async function demoDestroy() {
  const dockerCompose = spawn("docker-compose", ["down", "--volumes", "--rmi all"]);
  dockerCompose.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });
}
