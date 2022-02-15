# CLI manual test plan

## Using Node 14.18.1

1. Install package as global (`npm install -g`)
2. Move to a scratch directory, so it's easy to clean up. For reference we will call this `cli-test`


### Test that application starts

1. Execute `reaction help` and ensure that you get the help text

### Test that you can create an api project

1. Execute `reaction create-project api myserver`
2. Verify that the project was created
3. Change to that directory
4. Run `reaction develop api`. Ensure you get a message saying you need to run `npm install`
5. Run `npm install`
6. Run `reaction develop api`. Validate that Reaction starts in dev mode and you see log output
7. Hit Ctrl-C
8. Verify that the mongo docker image is shut down by running `docker-compose ps` from the command line and seeing an empty entry.

### Test that you can create a plugin within the api project
1. Navigate to the `myserver` directory that you just created
2. Run `reaction create-plugin api myplugin`
3. Validate that the plugin is created in the `custom-packages` directory
4. Run `reaction develop api` and ensure that the newly created plugin is loaded by checking the logs

### Test that you can create a storefront project

1. If you stopped it, start the api server again by running `reaction develop api` again from the directory you created
2. Open a new terminal window
3. From the `cli-test` directory run `reaction create-project storefront my-storefront`
4. Verify that the project was created
5. Change to that directory
6. Run `reaction develop storefront`. Ensure you get a message saying you need to run `yarn install`
7. Run `yarn install`
8. Run `reaction develop storefront`. Validate that storefront starts in dev mode and you see log output and that storefront loads in the browser

### Test that you can create an admin project

1. If the api server is not running start the api server again by running `reaction develop api` again from the directory you created
2. Open a new terminal window
3. Execute `reaction create-project admin my-admin` from the `cli-testing` directory
4. Verify that the project was created
5. Change to that directory
6. Run `reaction develop admin`. Ensure you get a message saying you need to run `npm install`
7. Run `npm install`
8. Run `reaction develop admin`. Validate that admin starts in dev mode and you see log output and the admin panel loads. Note that the admin can take a while to start so be patient

### Test that you can create a demo project

** Note that the server from above must be shutdown and mongo must be stopped for this to work.

1. Run `reaction demo mydemo`
2. Change to the `mydemo` directory
3. Check that the storefront, graphQL server and admin are all running (this might take a minute or so)

### Test that telemetry is turned off when set to off

1. Run `export SHOW_VERBOSE_TELEMETRY_DATA=1`
2. Run `reaction create-project api myserver-2`
3. Observe that all the tracking info is output and is correct
4. Run `reaction telemetry off`
5. Run any command except help or version
6. Observe that there is no telemetry output

### Test that GA info is being reported correctly

1. Ensure that telemetry is enabled
2. Go to `<your-home-directory>/.config/configstore/reaction-cli.json` and look for you `user` entry
3. Run `reaction create-project api telemetrycheck`
4. Log into GA console and look at the real time panel to ensure that the info was recorded correctly include os version, etc.
