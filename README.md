# *_`task bud`_* - _ccp7-solo-mvp.taskbud_
### This project was created during Code Chrysalis 🦋 Part-Time Immersive Cohort 7.

---

## What is *_`task bud`_*?

*_`task bud`_* is a task management tool for holding yourself and your buddies accountable.

<img alt="An iPhone screen shot of the task bud task management web app. A progress bar is displayed for the user and an accountability buddy." src="https://user-images.githubusercontent.com/6261485/234029152-cb1d752b-edfe-430a-bfa5-a36c3b55278a.png" width=300 />


## How to Use (Local/Dev) 🧑🏻‍💻

<details>

This repository is divided between [Server](/server) and [Client](/client) node.js packages.

### Installation

#### Server:

1. Open `/server` in a terminal and run `npm install` to install dependencies.

2. Create a cluster in MongoDB with a user authenticated through an X.509 certificate. Store the certificate somewhere safe in your local environment, preferably in a separate directory.

3. In the cluster, create a database (any name is fine). Inside the database create one collection named `task-lists` and another named `users`. MongoDB will create documents for each user when signing up through the client.

4. Back in `/server`, create a `.env` based on `.env.template`:
   - Assign your cluster's connection string to `MONGO_URI` [(click here to learn how to find this in Atlas)](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/#click-connect-3).
   - Assign the absolute filepath to your X.509 certificate as `MONGO_CERT_PATH`.
   - Assign the name of the database you just created to `MONGO_DB_NAME`.
   - `APP_URL` is only used for production.
   - `NODE_ENV` should be `development` when running locally.

5. Run `npm run dev` to start the server.

#### Client:

1. Open `/client` in a terminal and run `npm install` to install dependencies.

2. Create a `.env.local` file based on the other `.env.template`:
   - The `SUPABASE` variables should match your Supabase configuration.
   - The `API_URL` variable is only used for production.

3. Run `npm run dev` to start the client.

### Usage

1. Visit `https://localhost:3000` in your browser. (Setting your browser to responsive mode is strongly recommended - the app is currently designed for PWA installation.)

2. Sign up with a new account (this will create a new user in Supabase).

3. Repeat steps #1 & #2 in a separate browser with a different account.

4. Request to add one user from the other's account.

5. Accept the request.

6. Changes to one user's task list will be immediately reflected in the other's browser. (Task lists with no tasks display with 0% progress.)

</details>

## How to Use (Production) 📲

<details>

Under Construction 😜

### Installation

### Usage

</details>

## Future Plans

- Buddy interactions
- Push notifications
- Streamlined UI (modal editor vs. separate page, multiple selection)
- Task categories
- Daily lists
- Progress tracking over weekly timespans

## Resources

## License
©️ 2023 kappanjoe - All rights reserved. <br/>
This repository is published for demonstrative purposes only.
