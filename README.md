# Open Commerce CLI


## Note: Our new CLI is in it's very early stages. If you find any issues please reports them [here.](https://github.com/reactioncommerce/cli/issues)



## Overview
---
Mailchimp Open Commerce is an open-source, API-first, headless commerce platform built using Node.js, MongoDB, and GraphQL. It plays nicely with npm, Docker, and Kubernetes. Open Commerce brings together everything needed to build, deploy, and run online stores.

## Prerequisites 
---
Before you can use the Open Commerce CLI, ensure you have all the base requirements for your operating system: 
- [14.18.1 ≤ Node version < 16](https://nodejs.org/ja/blog/release/v14.18.1/)
- [Yarn](https://yarnpkg.com/cli/install)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation 
---
Before you can use the Open Commerce you need to install the command line tool: 

First install the cli by running: 
```
npm install -g @reactioncommerce/reaction-cli
```
 (on some systems you may need to run this with the `sudo` prefix):
 ```
sudo npm install -g @reactioncommerce/reaction-cli
```
## Creating a project
---
Create your Open Commerce project by running:
```
reaction create-project api my-server
 ```
 This will create an open commerce project in the directory `my-server`. You can name it whatever you want.
Once this is complete, run:
```
cd my-server
 ```
Then run:
```
npm install 
``` 
Finaly run:
```
reaction develop api
  ```
  This will start the Open Commerce GraphQL server and Mongo Server. Press Ctrl+C to stop.
- A sample custom plugin has been installed, and you should see its output in the logs. (Your Sample Plugin)
- To add a new plugin based on our plugin template run:
```
reaction create-plugin api <my-plugin-name>
```
 This plugin will now be loaded the next time you start Open Commerce.

## Usage
---
- It is always useful to be able to test the the CLI is working properly before you start using it. You can do that by clicking [here](https://github.com/reactioncommerce/cli/blob/trunk/test_plan.md) and following the instruction on the page. 

## Commands
---
```
 cli git:(trunk) reaction help                       
Usage: reaction [options] [command]

Options:
  -V, --version                           output the version number
  -h, --help                              display help for command

Commands:
  create-project [options] <type> <name>  Create a new Open Commerce project of one of the three types
  create-plugin <type> <name>             Create a new plugin based on the template for an API project
  develop [options] [type]                Run a project in locally in development mode
  telemetry <flag>                        Toggle on or off reporting anonymous usage
  help [command]                          display help for command
  ```
 ### Other Commands
- To build a dockerfile that includes your custom code while in the directory you can run: 
```
reaction build <api|admin|storefront>
 ```
- To install and run a docker-compose file that will launch all of the projects so that you can test them out you can run:
```
reaction create-project demo <my-demo>
```
- This is for evaluation purposes, not development.

## Contribution
---
If you find any issues please reports them [here.](https://github.com/reactioncommerce/cli/issues)

## Comparison to previous version 
---
This project sends back anonymous data to our analytics provider so we can understand how users are using the product.
If you want to see what data is being sent you can set the environment variable: `SHOW_VERBOSE_TELEMETRY_DATA` to `true`

## Licence
---