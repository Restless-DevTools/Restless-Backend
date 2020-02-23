# Restless Backend

## Installing NodeJS
```shell
sudo apt-get install build-essential
```
Execute the two bellows as super user:

```shell
curl -sL https://deb.nodesource.com/setup_12.x | bash -
```

```shell
apt-get install -y nodejs
```

## Getting started

```shell
$ git clone git@github.com:Felipedelima123/Restless-Backend.git
```

```shell
cd Restless-Backend
```

## Install Dependencies
```shell
yarn install
```

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

## TODO
[] - Add the authentication middleware, after the implementation;
[] - Add tests and mantain the coverage on 90%;
[x] - Configure the envs for the inteire project and make possible the dialect be chosen;
[] - Improve this docs, with motivation, vision and some other information about this project;
