# 11 Seed Script

We can use a script to "seed" the database instead of using Drizzle Studio. If needed, we can also reset the database when migration issues appear when creating relations to existing elements.

## Table of Contents
- [Building the Seed Script](#building-the-seed-script)
- [Running the Seed Script](#running-the-seed-script)
    - [Resolving Running the Seed Script](#resolving-running-the-seed-script)
- [Adding Courses with Seed Script](#adding-courses-with-seed-script)
    - [Why the TSX Package](#why-the-tsx-package)
- [Deleting and Reestablishing the Database](#deleting-and-reestablishing-the-database)


## Building the Seed Script

Within the root project folder, create a directory called **`scripts`**, and inside it a **script.ts** file. It will contain the following:

#### `scripts/seed.ts`

```tsx
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");
        
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        
        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};
```


## Running the Seed Script

This is our **seed script**, but it cannot currently run as any other file. Follow these steps to properly set up the command to run it.

<details>
<summary>Troubleshooting (Not Recommended)</summary>

Note that running the below command will prompt a SyntaxError that import statements cannot be used outside a module.

```bash
node scripts/seed.ts
```

To resolve this, we'll have to convert these import statements to be `const` variables with the `require()` keyword:

Before: 
```tsx
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
```

After: 
```tsx
const { drizzle } = require("drizzle-orm/neon-http");
const { neon } = require("@neondatabase/serverless");
```

However, there is a better way to go about this as there are many packages that can be used, like `tsnode` or `tsx`. More on this in the next section.
</details>

### Resolving Running the Seed Script

1. We can start resolving this error by simply calling the function at the end of the script:
    
    #### package.json
    ```tsx
    const main = async () => {/* ... */}
    
    main();
    ```

2. Then open the terminal and run the command to install the **TSX package** to our development dependencies:
    ```bash
    npm i -D tsx
    ```

3. Once that's installed, navigate back to the `package.json` file, and in our list of scripts, we want to add a custom command for running this file:

    ```json
    "scripts": {
        // ... omitted for brevity
        "db:seed": "tsx ./script/seed.ts"
    }
    ```

4. Now when we run the following command, it should log the messages we prepared and remove all the courses and user progress records from the database:

    ```bash
    npm run db:seed
    ```

Now we need a way to add language courses back to the database.

## Adding Courses with Seed Script

Within the `try` statement of the `const main` function, we want to create an array that holds the values we want for the courses:

#### `scripts/seed.ts`

```tsx
await db.insert(schema.courses).values([
    { id: 1, title: "Spanish", imageSrc: "/es-flag.svg" },
    { id: 2, title: "French", imageSrc: "/fr-flag.svg" },
    { id: 3, title: "Croatian", imageSrc: "/cr-flag.svg" },
    { id: 4, title: "Italian", imageSrc: "/it-flag.svg" },
]);
```

When running the command again, we should see the courses pop up with their ingrained functionality that we created, as well as the user progress that appears upon users accessing it.

### Why the TSX Package

The TSX package is used to run the script because (1) the seed script is in a TypeScript file, and therefore Node cannot be used without some modification, and (2) we have the alternative `ts-` (of `tsx`) node that can indeed run TypeScript, but this causes imports to be stuck and confuses them with Next imports, which is not what we want.

<!-- One thing that works better than these that comes right out of the box and without configurations is Bun, but it's still in development and is not recommended to use at the time this project was created -->


## Deleting and Reestablishing the Database

These scripts that we set up are not deleting the database but rather removing the fields. At times, we need to delete it when we encounter migration errors, the schema gets messed up while developing it, or the Drizzle Push command does not work anymore. So when that happens, leave the schema as is and go to your Neon account.

1. We need to access our Neon Account -> Databases -> Click the trash can icon, and the database will now disappear. Now we can create a **New Database**, naming it our current project **"lingo"** and proceed.

2. If for some reason the connection string changes, reveal it and copy it over to the **`.env`** file. Neon shouldn't change this when the database changes but when the project changes. Since we didn't change the project, the database URL does not need to be changed.

An error may be prompted stating that "courses" does not exist, which makes sense since our new database has no tables, let alone records which were deleted by the following code

```tsx
await db.delete(schema.courses);
await db.delete(schema.userProgress);
```

The seed script removes records but doesn't remove tables or the relations. That is why it's useful, in development only, to remove the entire database for the sake of being faster.

The proper way to do this is with migrations based on Drizzle documentation.

To fix the error, run the command and wait for changes to be applied for all the schemas to be pushed to our database via Drizzle:

```bash
npm run db:push
```

There is still no data, so let's run the seed script again to recreate the course entries:

```bash
npm run db:seed
```

Once we get the logs printed to our console, refresh the browser, and the courses should now be displayed again.
