# Staystrella 

![Landing page](https://res.cloudinary.com/dkofkuquf/image/upload/v1718382968/nuxtshop/quuh0quqxrwka8uh2vak.png)

This project is a Vacation Rental Platform inspired by Airbnb, built with **Nuxt 3**,
**Tailwind CSS**, **Headless UI**, **Neon PostgreSQL** for the database, **Drizzle ORM**,
**Lucia Auth** with GitHub and Google OAuth, **Leaflet** for map integration,
**Cloudinary** for image upload, **Zod** for validation and email verification and
password reset using **Resend** for sending email.

## Features

- **Responsive Design:** Provides a seamless experience across various devices and screen
  sizes.

- **Property Listings:** Users can browse through a curated list of properties, each
  showcasing essential details like title, location, price, available dates, and more.

- **Property Creation:** Hosts can create new property listings by providing relevant
  information, including title, location, property type, images, pricing details, and
  more.

- **Filters:** Users can find the right location and type of listing using advanced
  filtering options.

- **Authentication:** Implements secure authentication with GitHub and Google OAuth using
  Lucia Auth.

- **Email Verification and Password Reset:** Users can verify their email and reset
  passwords using Resend.

- **Map Integration:** Displays property locations using Leaflet for interactive map
  functionality.

- **Image Upload:** Hosts can upload company logos through Cloudinary, ensuring a visually
  appealing presentation of their listings.

## Technologies Used

- **Nuxt 3:** A powerful framework for building modern web applications with Vue.js.

- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **Headless UI:** A set of completely unstyled, fully accessible UI components for React
  and Vue.

- **Neon PostgreSQL:** A scalable, secure, and high-performance PostgreSQL database.

- **Drizzle ORM:** A lightweight and performant TypeScript ORM with developer experience
  in mind.

- **Lucia Auth:** A simple authentication library with support for OAuth.

- **Leaflet:** An open-source JavaScript library for mobile-friendly interactive maps.

- **Cloudinary:** A cloud-based image and video management service for efficient handling
  of uploaded logos.

- **Zod:** A TypeScript-first schema declaration and validation library.

- **Resend:** A simple, elegant interface so you can start sending emails in minutes.

![Trips page](https://res.cloudinary.com/dkofkuquf/image/upload/v1718234778/nuxtshop/bbn9mnnuvi5xoygawv8l.png)
![User profile](https://res.cloudinary.com/dkofkuquf/image/upload/v1718235273/nuxtshop/b8rvgta0h8g4ppn8febm.png)

## Setup

1. **Clone the repository.**

   ```bash
   git clone https://github.com/atalek/staystrella.git

   ```

2. **Navigate to the project directory.**

   ```bash
   cd staystrella

   ```

3. **Install dependencies.**

   ```bash
   npm install

   ```

4. **Configure environment variables.**

- Create a `.env` file in the root of the project.
- Add the necessary environment variables for Stripe and Cloudinary.

  ```env
  #Neon psql
  DATABASE_URL="your neon database url"

  #GITHUB OAUTH
  GITHUB_CLIENT_ID="your github client id"
  GITHUB_CLIENT_SECRET="your github client secret"

  #GOOGLE OAUTH
  GOOGLE_CLIENT_ID="your google client id"
  GOOGLE_CLIENT_SECRET="your google client secret"
  BASE_URL="your website uri or http://localhost:3000 in development"

  # Cloudinary
  CLOUDINARY_URL ='cloudinary://cloudinary_api_key:cloudinary_api_secret@cloudinary_name'
  CLOUDINARY_PATH ='your cloudinary base url'
  CLOUDINARY_NAME="your cloud name"
  CLOUDINARY_FOLDER="your cloudinary folder"
  CLOUDINARY_API_KEY="your cloudinary api key"
  CLOUDINARY_API_SECRET="your cloudinary api secret"


  # Resend
  RESEND_API_KEY="your resend api key"
  API_ROUTE_SECRET="api route secret used for protecting your email endpoints"

  #Google tag
  GTAG_ID="google tag"


  ```

5. **Run the migration and development server.**

   ```bash
   npm run db:push
   npm run dev

   ```

6. **Open your browser and visit http://localhost:3000 to view your Vacation Rental
   Platform.**

## Live Version

[https://staystrella.atalek.com/](https://staystrella.atalek.com/)

## Author

Github [@atalek](https://github.com/atalek) <br> Linkedin:
[@Aleksandar Atanasovski](https://www.linkedin.com/in/aleksandar-atanasovski-16b123263/)
<br> Portfolio: [https://www.atalek.com/](https://www.atalek.com/)
