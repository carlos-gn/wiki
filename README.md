# Wiki
> A modern, lightweight and powerful wiki app built on NodeJS, Git and Markdown

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Usage](#usage)
* [Deploying](#Deploying)
* [Feature Requests](https://feedback.js.wiki/wiki)
* [Contact](#contact)
* [License](#license)



## General Information
- A modern, lightweight and powerful wiki app built on NodeJS, Git and Markdown

## Technologies Used
- Vue js - version 2.6.16
- Node - version 16.0
- Apollo - version 2.6.0
- PostgreSQL - version 9.5 or later

## Setup
- Install `docker`
- Create a personal access [token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Clone the repository
- Run ```export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token
  --domain npm --domain-owner YOUR_AWS_ACCOUNT_ID --query authorizationToken --output text --region eu-west-1` ```
- In the project folder run `npm install --legacy-peer-deps`


## Usage
- Run `docker-compose up`
- Run `npm run dev`
- Open [link](http://localhost:3000) in your browser


## Deploying
- We do automatic deploying only for `master` and `dev` branches, once your changes will be pushed there it will be automatically deployed.
- To manually deploy run `npm run deploy` which will build and deploy the app.

## Contact
Created by [@aviv](mailto:aviv@deel.com) - feel free to contact me!


## License
This project available under the [AGPL-3.0](https://github.com/requarks/wiki/blob/master/LICENSE)
