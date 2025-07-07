<h3 align="center">
  <a href="https://andrasapplied.netlify.app/" target="_blank" rel="noopener noreferrer">
  <img src="https://github.com/AndrasE/raw-readme/blob/7a93175c63780473dfa44e00cbd97021d55e5d90/logo/applied-readme.png" width="135">
  </a>
  <br>
  Vue 3 CRUD app powered by Firebase Realtime Database
  <br>
Includes OAuth authentication, Tailwind CSS, and TypeScript
</h3>

## Hello there 👋

This project showcases a simple CRUD (Create, Read, Update, Delete) application built with Vue 3, TypeScript, and Firebase Realtime Database. I selected Firebase for its real-time syncing capabilities and straightforward integration, allowing me to focus on the app’s logic and design.

The app was designed to help track job applications after I realised how difficult it was to keep everything organised during my own job search. It includes authentication using Firebase (currently admin-only), real-time data updates, and charts powered by ApexCharts for visualising progress. I also implemented skeleton loaders for better UX during data fetching, and toast notifications using Vue Toastification.

Tailwind CSS was used for styling, offering a fast, responsive, and consistent UI. The app is installable as a Progressive Web App (PWA), enabling offline access and improved performance.

For a more in-depth breakdown of the project's evolution and features, and practical examples, please visit the app and click on the logo. You will find an About section.

<div align="center">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_1.png" width="240">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_2.png" width="240">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_3.png" width="240">
</div>

### Packadges used

- **[vue](https://vuejs.org/)** - JavaScript framework used to build this application, leveraging the Composition API for better structure and reusability.

- **[firebase](https://firebase.google.com/docs/web/setup)** -  Provides real-time database and authentication services, enabling data syncing and secure access.

- **[pinia](https://pinia.vuejs.org/)** -   – A lightweight and intuitive state management library for Vue.

- **[vue-router](https://router.vuejs.org/)** - Handles client-side routing and navigation between views within the app.

- **[tailwindcss](https://tailwindcss.com/)** - A utility-first CSS framework used for styling, offering responsive design and fast prototyping.

- **[@headlessui/vue](https://headlessui.com/)** - Provides accessible, unstyled UI components that integrate well with Tailwind CSS. Used it for styled dropdown menu.

- **[apexcharts + vue3-apexcharts](http://apexcharts.com/)** - – Used for rendering interactive and responsive chart to visualise job tracking data.

- **[vue-toastification](https://vue-toastification.maronato.dev/)** - Adds elegant toast notifications for user feedback without interrupting flow.

- **[vue3-lottie](https://www.npmjs.com/package/vue3-lottie)** -
 Enables the use of Lottie animations for engaging visual feedback and loaders.

- **[vite](https://vite.dev/)** - A modern build tool and development server that provides fast bundling and hot module replacement.

- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** - Adds Progressive Web App support, allowing users to install the app and use it offline.

- **[typeScript](https://www.typescriptlang.org/)** - Used throughout the codebase to add static typing and improve maintainability and developer experience.

## Run 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Start with cloning this repo on your local machine via cli or github-desktop:

`
$ git clone https://github.com/AndrasE/applied
$ cd applied
`

To install and set up the library, run:

`
$ npm install
`

Or if you prefer using Yarn:

`
$ yarn install
`

Create a firabase webapp add real-time database and authentication & edit firebase.ts or add .env

```js
VITE_API_KEY="your-api-key"
VITE_AUTH_DOMAIN="your-auth-domain"
VITE_PROJECT_ID="your-project-id"
VITE_STORAGE_BUCKET="your-storage-bucket"
VITE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_APP_ID="your-app-id"
VITE_ADMIN_UID=" your Google account's User ID (UID)"
```

Setup firbase rules

```js
  "rules": {
    "jobs": {
      ".read": true,
      ".write": "auth != null && auth.uid == 'YOUR UID'",
    }
  }
```

Serving the app:

`
$ npm run dev
`

Building a distribution version:

`
$ npm run build
`
