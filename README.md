## API for daily diet control, the Daily Diet API.

Daily Diet is a mobile application for controlling your diet. Here, you can record your meals and track your progress.

## Technologies used:

To develop this API, used the following technologies/libraries:

-Node;
-TypeScript;
-Fastify;
-Knex;
-Zod;

### Application rules

- It must be possible to create a user
- It must be possible to identify the user between requests
- It must be possible to record a meal eaten with the following information:

  _Meals must be related to a user._

  - Name
  - Description
  - Date and time
  - Is it on the diet or not

- It must be possible to edit a meal, being able to change all the data above
- It must be possible to delete a meal
- It should be possible to list all of a user's meals
- It must be possible to view a single-meal
- It must be possible to retrieve a user's metrics

  - Total number of meals recorded
  - Total number of meals within the diet
  - Total number of meals outside the diet
  - Better sequence of meals within the diet

- The user can only view, edit and delete the meals he created

### Application context

When developing an API, it is common to imagine how this data will be used by the web and/or mobile client. Below, you can see what this app would look like in the mobile version.
