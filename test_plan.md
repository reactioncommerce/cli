# CLI manual test plan

## For each version of node supported (14, 16, 17)

1. Move to a scratch directory, so it's easy to clean up
2. Install package as global (`npm install -g`)

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
8. Verify that the mongo docker image is shut down

### Test that you can create a plugin within the api project
1. Navigate to the `myserver` directory that you just created
2. Run `reaction create-plugin api myplugin`
3. Validate that the plugin is created in the `custom-packages` directory
4. Run `reaction develop api` and ensure that the newly created plugin is loaded by checking the logs

### Test that you can create a storefront project

1. If you stopped it, start the api server again by running `reaction develop api` again from the directory you created
2. Open a new terminal window
3. Execute `reaction create-profile storefront my-storefront`
4. Verify that the project was created
5. Change to that directory
6. Run `reaction develop storefront`. Ensure you get a message saying you need to run `npm install`
7. Run `yarn install`
8. Run `reaction develop storefront`. Validate that storefront starts in dev mode and you see log output and that storefront loads in the browser

### Test that you can create an admin project

1. If the api server is not running start the api server again by running `reaction develop api` again from the directory you created
2. Open a new terminal window
3. Execute `reaction create-profile admin my-admin`
4. Verify that the project was created
5. Change to that directory
6. Run `reaction develop admin`. Ensure you get a message saying you need to run `npm install`
7. Run `npm install`
8. Run `reaction develop admin`. Validate that admin starts in dev mode and you see log output and the admin panel loads

### Test that you can create a demo project

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
