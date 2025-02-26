# Project Title

Rainbow Baby Dragon eCommerce API solution - A NestJS-based Backend for Learning purposes.

## Description

> [!NOTE]  
> The project have been tested and developed on debian bookworm, with postgresql and node. The newest version LTS version have been used of all software, but it is likely to work on older version too. Use at own risk on older software. For translations emails, SMTP service provide by gmail have been used, any SMTP should work

This project is a [NestJS](https://nestjs.com/) backend with my code, created for learning purposes. It supports user authentication (Not yet implemented), product management, and payment processing via Stripe.

**Key Features:**

- User Authentication
- Product Management
- Payment Processing via

> [!WARNING]  
> This project is not intended for production use.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

> [!WARNING]  
> To install the product you must have the following software installed:

- [node](https://nodejs.org/en)
- [npm](https://github.com/npm/cli)
- [git](https://git-scm.com/)

> [!IMPORTANT]  
> If you want to use stripe for payment processing, you need a [stripe account](https://dashboard.stripe.com/login) - At this time, only stripe is supported

```bash
git clone https://github.com/hjmosedk/eCommerceAPI
cd eCommerceAPI
npm install
```

## Environment Variables

Before running this project, you will need to set the following environment variables in your `.env` file or your system's environment settings:

- `DATABASE_HOST`: The host address of your database - It can be both a url, a ip or "localhost
- `DATABASE_PORT`: The port of the database, if running on postgresql this will be 5432
- `DATABASE_USERNAME`: This is the username of the database user to access the database, it is recommend for security reasons not to use a privileged user - I use a project specific user
- `DATABASE_PASSWORD`: The password of the database user, i use a password manager to generate unique passwords
- `DATABASE_NAME`: The name of the database to connect to
- `ALLOWLIST`: This is a list of ip or URL, where CORS is disabled
- `STRIPE_KEY`: This is the secret key for stripe
- `DEFAULT_CURRENCY`: This is the default currency of the application
- `FRONTEND`: This is the location of the frontend, if a frontend is used
- `SMTP_USERNAME`: The username for your chosen SMTP provider
- `SMTP_PASSWORD`: The password for your chosen SMTP provider
- `EMAIL_HOST`: This is the SMTP provider
- `HTTPS_KEY`: This is the location of key used for SSL encryption
- `HTTPS_CERT`: This is the location of certification for SSL encryption
- `FROM_EMAIL`: This is the email used in translations email as from

- `SECRET_KEY`: A secret key for your application
- `API_KEY`: Your API key for accessing external services
- `NODE_ENV`: Set to `development` or `production`

Example `.env` file:

```plaintext
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=webshop
DATABASE_PASSWORD=superSecretPassword
DATABASE_NAME=webshop
ALLOWLIST=https://frontEnd.com
STRIPE_KEY=secretKeyFromStripe
DEFAULT_CURRENCY=dkk
FRONTEND=https://frontEnd.com
SMTP_USERNAME=SMTP
SMTP_PASSWORD=superSecretPassword2
EMAIL_HOST=smtp.gmail.com
HTTPS_KEY=./src/cert/192.168.1.135-key.pem
HTTPS_CERT=./src/cert/192.168.1.135.pem
FROM_EMAIL: support@webshop.dk
```

Remember to change the values base on the relevant use case

## Usage

Once all the installing have completed successfully the software can be run in development mode via:

```bash
npm run start:dev
```

If there is no errors, the swagger documentation can be found [here](https://localhost:3000/api)
The route for this access is localhost:3000/api.

The project can be run in production mode via:

```bash
npm run start
```

## Contributing

In case of contribution please contact author directly.

## License

See [License](./LICENCE.md)
