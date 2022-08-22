# Open Commerce CLI


> Note: Our new CLI is in its very early stages. If you find any issues please report them [here.](https://github.com/reactioncommerce/cli/issues)



## Overview
---
The CLI is the quickest and easiest way to develop on Open Commerce. It allows you to create and work with API, Admin, and Storefront projects all via the command line.

## Prerequisites 
---
Before you can use the Open Commerce CLI, ensure you have all the base requirements for your operating system: 
- We recommend installing [nmv](https://github.com/nvm-sh/nvm) 
- [14.18.1 ≤ Node version < 16](https://nodejs.org/ja/blog/release/v14.18.1/)
- [Yarn](https://yarnpkg.com/cli/install)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation 

Before you can use the Open Commerce CLI you need to install the command line tool: 

### From NPM (Suggested method)
First install the cli by running:
```
npm install -g reaction-cli
```

You can test to see if it has worked here by running:

```
reaction help
```
You should see the help text showing.

### From a Cloned repo

First clone the repo locally (substitute <my-directory> with whatever directory name you want to use)

```bash
git clone git@github.com:reactioncommerce/cli.git <my-directory>
```

then cd into the directory you just created
```bash
cd <my-directory>
```

Then run npm install inside the CLI directory

```bash
npm install
```

Then install the CLI globally (this may require `sudo` on some systems):

```bash
npm install -g
```

## Creating a project
---

You can create your Open Commerce project by running:
```
reaction create-project api <your-project-name>
 ```
 This will create an Open Commerce project in the directory <your-project-name>.
Once this is complete, run:
```
cd <your-project-name> 
 ```
Then run:
```
npm install 
```
Finaly run:
```
reaction develop api
  ```
  
  Note: Optionally, from within the project-directory you may issue the above command without mentioning the project type and the CLI would check your package.json for the "projectType" and pick it up from there. This expects that the project itself was built using the latest version of the CLI as explained in the above steps.

  Example, instead of the above command, you may skip mentioning 'api' and just run: 
  ```
  reaction develop
  ```

  This will start the Open Commerce GraphQL server and Mongo Server. Press Ctrl+C to stop.

- A sample custom plugin has been installed, and you should see its output in the logs. (Your Sample Plugin)
- To add a new plugin based on our plugin template run:
```
reaction create-plugin api <your-plugin-name>
```
Validate whether the plugin was created in the "custom-packages"
```
cd custom-packages
```
``` 
cd <your-plugin-name>
```
```
npm install 
```
You now need to change back up to the root:
```
cd ../../
```
now you can run:
```
reaction develop
```
 This plugin will now be loaded the next time you start Open Commerce.

 ### Congratulations!! You're ready to start developing with Open Commerce 

## Add the Admin/Storefront 
---
Open Commerce includes an Admin panel for managing your system plus an example storefront implementation so you can see how you would go about building your own.

## Adding the Admin

To add the admin project you can run:
```
reaction create-project admin <your-admin-name> 
```
and a `your-admin-name` directory will be created in the new directory. 

Change to that directory by running:
```
 cd <your-admin-name> 
```
Then run:
```
npm install
```
and you can start the admin project by running:
```
reaction develop
```
For more information about developing the admin you can go to [Mailchimp Open Commerce Documentation](https://mailchimp.com/developer/open-commerce/)

## Adding a Storefront
To add the example storefront project so you can browse your installation just run:
```
reaction create-project storefront <your-storefront-name>
```
To run the storefront navigate to the newly created storefront directory by running: 
```
cd <your-storefront-name>
```
and run:
```
npm install
```
and then:
```
reaction develop
```
The storefront will be available on port https//localhost:4000

## Update the plugins
To update the plugins in your project so you can run the below command:

Navigate to your project directory:
```
cd <your-api-directory>
```
and run the update command:
```
reaction update
```
To quickly update all your plugins:
```
reaction update --all
```
Your outdated plugins will be updated to the latest version.
 ## Other Commands
---
- For a full list of commands run:
```
reaction help
```

- To build a dockerfile that includes your custom code while in the directory you can run: 
```
reaction build <api|admin|storefront>
 ```
- If you're looking to evaluate or demo the Admin, Storefront, and API simultaneously you can run:
```
reaction create-project demo <you-demo-name>
```
```
cd <your-demo-name>
```
Check that the storefront (localhost:4000), graphQL server (localhost:3000) and admin (localhost:4080) are all running (this might take a minute or so).

## Contribution
---
If you find any issues please reports them [here.](https://github.com/reactioncommerce/cli/issues)

## Telemetry 
---
This project sends back anonymous data to our analytics provider so we can understand how users are using the product.
If you want to see what data is being sent you can set the environment variable: 
Run:
```
export SHOW_VERBOSE_TELEMETRY_DATA=1
```
```
reaction create-project api myserver-2
```

If you want to turn the telemtry data off indeffinitely you can run:
```
reaction telemetry off
```
to turn it back on run: 
``` 
reaction telemetry on
```

## Developer Certificate of Origin
---
We use the [Developer Certificate of Origin (DCO)](https://developercertificate.org/) in lieu of a Contributor License Agreement for all contributions to Reaction Commerce open source projects. We request that contributors agree to the terms of the DCO and indicate that agreement by signing all commits made to Reaction Commerce projects by adding a line with your name and email address to every Git commit message contributed:

```
Signed-off-by: Jane Doe <jane.doe@example.com>
```

You can sign your commit automatically with Git by using `git commit -s` if you have your `user.name` and `user.email` set as part of your Git configuration.

We ask that you use your real name (please no anonymous contributions or pseudonyms). By signing your commit you are certifying that you have the right have the right to submit it under the open source license used by that particular Reaction Commerce project. You must use your real name (no pseudonyms or anonymous contributions are allowed.)

We use the [Probot DCO GitHub app](https://github.com/apps/dco) to check for DCO signoffs of every commit.

If you forget to sign your commits, the DCO bot will remind you and give you detailed instructions for how to amend your commits to add a signature.

## License
---
Copyright 2022

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
