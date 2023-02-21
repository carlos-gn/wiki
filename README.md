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
- Fork the repository
- Run  ```zsh export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token
  --domain npm --domain-owner YOUR_AWS_ACCOUNT_ID --query authorizationToken --output text --region eu-west-1` ```
- In the project folder run `npm install --legacy-peer-deps`


## Usage
- Run `docker-compose up`
- Run `npm run dev`
- Open [link](http://localhost:3000) in your browser


## Deploying
- To deploy, simply push your code, and it will be auto-deployed to the whichever branch you pushed to. Say you're on branch `test`, after running `git push`, your code will be deployed
  Manual Deploying.
- To manually deploy run `npm run deploy` which will build and deploy the app.


## Contact
Created by [@aviv](mailto:aviv@deel.com) - feel free to contact me!


## License
This project available under the [AGPL-3.0](https://github.com/requarks/wiki/blob/master/LICENSE)
