# cli
A command line tool for creating, developing and deploying Open Commerce projects

This is using some "Documentation Driven Development" so that this flow is focused on making the first development experience easy and simple.

# Getting Started with Open Commerce

**Note:** The name of the CLI is pending, just using cli here as a placeholder.
It can be renamed at any point in development

## Step One - Create your project

1. First install the cli by running `npm install -g cli`
2. Create your Open Commerce project by running `cli create-project api my-server --populate`. This will create an open source project in the directory `my-server` and populate it with sample data. You can name it whatever you want.
3. Once this is complete do `cd my-server` and then run `cli develop`. This will start the Open Commerce GraphQL server.
4. A sample custom plugin has been installed, and you should see it's output in the logs. (Your Sample Plugin)

### Congratulations!! You're ready to start developing with Open Commerce.

## Step Two - Create your first plugin
link to documentation for creating plugin


## Step Three - Add the admin/storefront

### Adding the Admin

1. To add the admin project you can run `cli create-project admin` and an `admin` directory will be created
2. To start the admin, open another terminal window and navigate to that directory and type `npm run start`. The admin will not be available on port 4080
3. For more information about developing the admin you can go to #link

### Adding a Storefront

1. To add the example storefront project so you can browse your installation just run `cli create-project storefront`
2. To run the storefront navigate to the newly created `storefront` directory and type `npm run start`. The storefront will be available on port 4000

### To add another plugin

A simple example plugin is already installed when you created the project, but should you want to add another plugin simple type `cli create-plugin api my-plugin`. This will create your plugin based on our template and add it to your `plugins.json`
Your plugin directory is configured to publish to npm so you can run by default. You can publish your plugin (assuming you have an established npm account)
with `cli publish`. Note that the use the published package you will need to edit your plugins.json to point at the package rather than the local version.

### To build a Dockerfile for Deployment

Included in your project is a Dockerfile that will combine core Reaction with your custom plugins. To build this docker image
simply run `cli docker build`.

##**Future**

### To deploy your project to one of the supported cloud hosting just type:

`cli deploy digital-ocean/aws/gcp/azure`
