# analyze-repos

analyze-repos is a node app configured to use Typescript scaffolded using the package `@enrico.piccinin/create-node-ts-app`.

analyze-repos can be published as a package on the public NPM registry.

Once published, analyze-repos can be invoked to execute a command using `npx`

Contains a configuration for `eslint` and `prettier`.

Testing is based on the `mocha` and `chai` libraries.

The `src` folder has the following structure:

-   `lib` folder containing the command
-   `core` folder containing `exec-command.ts` which implements the logic to execute the command
-   `core/internals` folder containing the internals of the logic of the command

## test

Run the tests using the command

`npm run test`

## Publish on NPM registry

To publish on NPM registry the package rune the command

`npm publish`

## Execute the command

Once published on NPM registry the command defined by the package can be executed running the command

`npx analyze-repos`
