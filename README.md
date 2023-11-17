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

![Screen Shot 2023-11-17 at 18 20 08](https://github.com/tiagoluis12/daily-diet-api/assets/128226293/5de06dc5-32fd-4f14-af8a-b77565402149)

![Screen Shot 2023-11-17 at 18 20 41](https://github.com/tiagoluis12/daily-diet-api/assets/128226293/1a0a4d83-d180-4919-abe1-eebac78d2d38)

![Screen Shot 2023-11-17 at 18 20 51](https://github.com/tiagoluis12/daily-diet-api/assets/128226293/8ab357ce-5211-4389-9fed-f1839194bdbe)

![Screen Shot 2023-11-17 at 18 21 46](https://github.com/tiagoluis12/daily-diet-api/assets/128226293/24c2529e-ccb2-4d59-85c2-432b1483f208)






