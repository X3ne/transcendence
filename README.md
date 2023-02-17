# Nest, swagger, sequelize + Docker + postgres + dev hot reload

## Setup

Copy .env.example and rename it to .env

Run `docker-compose up -d`

## Pg Admin

Open your browser and go to `localhost:5050`

Login with the email and the password in the .env file

```
PGADMIN_DEFAULT_EMAIL
PGADMIN_DEFAULT_PASSWORD
```

Right-click on `Severs` > `Register` > `Server`

Enter a name in the `Name` field

Go to `Connection` tab

Open a terminal and enter this command,
```
docker inspect postgres | grep IPAddress
```

Copy `IPAddress` and past it into the `Host name/address` field on pgAdmin

`Port`, `Username` and `Password` should be similar to the variables `DB_PORT`, `DB_USER` and `DB_PASS` in .env

Press `Save`
