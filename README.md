# Getting Started with Open Commerce

## Note: Our new CLI is in it's **very early stages**. If you find any issues please report them [here](https://github.com/reactioncommerce/cli/issues)

## Prerequisites

* Node 14.18.1 or greater < 16
* [Yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)


## Step One - Install the command line tool

1. Run the cli by running `npm install -g @reactioncommerce/reaction-cli` (on some systems you may need to run this with the `sudo` prefix)

## Step Two - Create your project(s)

2. Create your Open Commerce project by running `reaction create-project api my-server`. This will create an open commerce project in the directory `my-server`. You can name it whatever you want.
3. Once this is complete do `cd my-server` and then run `npm install` and then `reaction develop api`. This will start the Open Commerce GraphQL server and Mongo Server. Press Ctrl+C to stop
4. A sample custom plugin has been installed, and you should see its output in the logs. (Your Sample Plugin)
5. To add a new plugin based on our plugin template run `reaction create-plugin api <my-plugin-name>`. This plugin will now be loaded the next time you start Open Commerce.

### Congratulations!! You're ready to start developing with Open Commerce.

## Step Three (optional) - Add the admin/storefront

Open Commerce includes an Admin panel for managing your system plus an example storefront implementation so you can see how you would go about building your own.

### Adding the Admin

1. To add the admin project you can run `reaction create-project admin <myadminname>` and a `<myadminname>` directory will be created
2. In the new directory run `npm install`
3. You can start the admin project by running `reaction develop admin`
5. For more information about developing the admin you can go to [Mailchimp Open Commerce Documentation](https://mailchimp.com/developer/open-commerce/)

### Adding a Storefront

1. To add the example storefront project so you can browse your installation just run `reaction create-project storefront`
2. To run the storefront navigate to the newly created `storefront` directory and do `npm install` and then `npm run start`. The storefront will be available on port 4000

### More Commands

* You can run `reaction build <api|admin|storefront>` to build a dockerfile that includes your custom code while in the directory
* You can run `reaction create-project demo <my-demo>` to install and run a docker-compose file that will launch all of the projects so that you can test them out. This is for evaluation purposes, not development. 

> **NOTE:** All data for a demo is stored on its docker volume named `<my-demo>_mongo-db4demo`. To completly clear the data used by a demo run `docker-compose down --volumes`. Alternatively you can list the volumes using `docker volume ls` and remove it by name using `docker volume rm <my-demo>_mongo-db4demo`.


### Telemetry

This project sends back anonymous data to our analytics provider so we can understand how users are using the product.
If you want to see what data is being sent you can set the environment variable: `SHOW_VERBOSE_TELEMETRY_DATA` to `true`

