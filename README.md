![Restless Logo](https://raw.githubusercontent.com/Restless-DevTools/Restless-Backend/master/docs/images/restless-logo.png)

Restless is a platform that aims to help developers in their daily lives. It is possible to manage, store, execute and share HTTP and HTTP requests. It is also possible to create teams, Snippets and Jobs. 

You will find us [here](https://restlessdevtools.com). Not yet, but soon!

# About
We are <b>restless</b>, we are always ahead of new technologies, building the world as it is. The great masses do not always remember us, or realize that we exist. For every post on a social network, for every like or every message sent, there was a massive work from someone like you who is reading this right now.

Some are reading this and, at the moment, know only how to write a Hello World in any language, others just a simple API, or maybe you are training artificial intelligence models and some are doing experiments quantum computing. 

The world depends on us, everything is connected today and without developers nothing would be possible. This is just to remind you of how important you are, and however insignificant your work may seem, it is part of something much bigger. 

This project knows the importance of each developer around the world and it is for you that this platform is being built. We would love to have your feedback and if you are comfortable, your contribution. 

Made by developers, for developers. 

# Self hosted
You can host Restless on your own server, free of charge. Thus, small startups, beginning developers and students will be able to use credits from infrastructure platforms and use it for free. Large and medium-sized companies that have their own hardware and if it is more feasible to host it on their own, will also be exempt from monthly fees. 

# Features
- <b>Requests:</b> your requests, grouped by collections, where you can execute, change and share them;
- <b>Snippets:</b> these are small codes that you love, want to save and sometimes want to share with your co-workers;
- <b>Docs:</b> you will use it to create your public API’s documentation and send it to your customers and suppliers, or to anyone who is interested;
- <b>Jobs:</b> will provide the automation of requests made repeatedly and workflows through parameterizable and codable Jobs.

# There is a lot to do
Not everything described here is complete or available at this time. We are working hard to bring this to the community and provide the best experience possible with the plataform. 


# Restless Backend

## Installing NodeJS
```shell
sudo apt-get install build-essential
```
Execute the two bellows as super user:

```shell
curl -sL https://deb.nodesource.com/setup_14.x | bash -
```

```shell
apt-get install -y nodejs
```

## Instaling PostgreSQL
You can run with any version >= 9.5. You can find [here](https://www.postgresql.org/download/).

## Getting started

```shell
git clone git@github.com:Restless-DevTools/Restless-Frontend.git
```

```shell
cd Restless-Backend
```

## Install Dependencies
```shell
yarn install
```

## Env File
Make sure that you have an .env file. You can follow the example of the .env.example.

## Database
Make sure that you have a database created. The application will sync then automatically, just create an empty database.

## Running for Development
```shell
yarn dev
```

## Project Structure
| Folder      | Description                                                           |
|-------------|-----------------------------------------------------------------------|
| config      | Config files for general purposes                                     |
| controllers | Defines your app routes and the params for the service                |
| helpers     | Code and functionality to be shared by different parts of the project |
| middlewares | Express middlewares which process the incoming requests               |
| migrations  | The files for the database changes                                    |
| models      | Represents data                                                       |
| repository  | Handles the operations for the access to the database                 |
| service     | Implements business logic                                             |
| __tests__   | Tests everything which is in the other folders                        |

## Request Flux
Route -> Middleware -> Controller -> Service -> Repository -> Database

