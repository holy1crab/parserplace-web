# Parser Place

The idea of a project is that it will help you find optimal goods price.   
Basically you create a **subscription**. Subscription may consist of multiple **links** from different  
websites where you can order the item you want. The service will start monitoring prices and availability 
and notify you when the price or availability is changed.

## Run tasks

To run the dev server for your app, use:

```sh
  npx nx serve parserplace-web
```

To create a production bundle:

```sh 
  npx nx build parserplace-web
```

To see all available targets to run for a project, run:

```sh
  npx nx show project parserplace-web
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.
