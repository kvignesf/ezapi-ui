# EzAPI Intelligent Miner

This repository contains code for frontend of the EzAPI designer. It's built using ReactJs, TailwindCSS, RecoilJs.

## Prerequisites

1. Node Package Manager (NPM)

## Project Setup

Note: These instructions are for macOS and Linux.

1. Install all the dependencies if not installed:

```bash
npm install
```

2. Populate the .env file having following variables:

   - REACT_APP_API_URL
   - REACT_APP_LINKEDIN_CLIENT_ID
   - REACT_APP_STRIPE_KEY

3. Run the application locally

```bash
npm run start
```

Open the browser and go to [http://127.0.0.1:3000/](http://127.0.0.1:3000/). You'll be redirected to default homepage

## Application Components

The entire EzAPI Designer Webapp consists of the following core libraries -

1. [https://reactjs.org](ReactJs)
2. [https://tailwindcss.com](TailwindCSS)
3. [https://recoiljs.org](RecoilJs)
4. [https://react-query.tanstack.com](ReactQuery)
5. [https://reactrouter.com](ReactRouter)

### Folder Structure -

_The whole application is structured as features._

##### Files and folders

```python
- /App.jsx - Contains the core component which acts as an entry point of the application
- /index.jsx - Contains the root component of the application
- /index.css - Contains the common styles used in the application
- /tailwind.config.js - Contains the configuration data required by the tailwindcss
- /craco.config.js - Contains the configuration data required by the craco. [https://www.npmjs.com/package/@craco/craco](Craco) modifies the webpack on the fly without us having to eject the react application.

- /static/ - This module contains all the assets such as images
- /shared/atom - Contains all the common atoms ([https://recoiljs.org/docs/basic-tutorial/atoms/](Atom)) shared by the features
- /shared/components - Contains all the components shared by the features
- /shared/network/client - Base network client used in the application
- /shared/network/queryClient - Base react-query client used in the application
- /shared/query - Contains all the queries shared by the features
- /shared/schemas - Contains all the schemas shared by the features
- /shared/colors - Contains all the colors. Note that any change here has to be updated in /tailwind.config.js
- /shared/constants - Contains all the contants.
- /shared/routes - Contains all the navigatable routes used in the project.
- /shared/storage - Helper file which contains all the utilities to store and retreive the key/value pairs.
- /shared/storage - Contains the common utility functions.

```
