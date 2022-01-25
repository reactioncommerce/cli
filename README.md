# reaction-cli
A command line tool for creating, developing and deploying Open Commerce projects


# Getting Started with Open Commerce

## Prerequisites

* Node 14.8 or greater
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)


## Step One - Install the command line tool

1. First install the cli by running `npm install -g @reactioncommerce/reaction-cli` (on some systems you may need to run this with the `sudo` prefix)

## Step Two - Create your project(s)

2. Create your Open Commerce project by running `reaction create-project api my-server`. This will create an open commerce project in the directory `my-server`. You can name it whatever you want.
3. Once this is complete do `cd my-server` and then run `npm install` and then `reaction api develop`. This will start the Open Commerce GraphQL server and Mongo Server.
4. A sample custom plugin has been installed, and you should see its output in the logs. (Your Sample Plugin)

### Congratulations!! You're ready to start developing with Open Commerce.

## Step Three (optional) - Add the admin/storefront

Open Commerce includes a Admin panel for managing your system plus an example storefront implementation so you can see how you would go about building your own.

### Adding the Admin

1. To add the admin project you can run `reaction create-project admin <myadminname>` and a `<myadminname>` directory will be created
2. In the new directory run `npm install`
3. You can start the admin project by running `reaction develop admin`. Or...
4. Run `npm run start`. The admin will now be available on port 4080
5. For more information about developing the admin you can go to #link

### Adding a Storefront

1. To add the example storefront project so you can browse your installation just run `reaction create-project storefront`
2. To run the storefront navigate to the newly created `storefront` directory and do `npm install` and then `npm run start`. The storefront will be available on port 4000

### To add another plugin

A simple example plugin is already installed when you created the project, but should you want to add another plugin simple type `cli create-plugin api my-plugin`. This will create your plugin based on our template and add it to your `plugins.json`
Your plugin directory is configured to publish to npm so you can run by default. You can publish your plugin (assuming you have an established npm account)
with `cli publish`. Note that the use the published package you will need to edit your plugins.json to point at the package rather than the local version.

### Telemetry

This project sends back anonymous data to our analytics provider so we can see understand how we can understand how users are using the product.
If you want to see what data is being sent you can set the environment variable: `SHOW_VERBOSE_TELEMETRY_DATA` to `true`
##**Future**

### To deploy your project to one of the supported cloud hosting just type:

`cli deploy digital-ocean/aws/gcp/azure`
