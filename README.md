# Ball-API

[![Join the chat at https://gitter.im/PurpleBooth/ball-api](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/PurpleBooth/ball-api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For a joke app we talked about for the [DevMeetDesign meetup](http://www.meetup.com/devmeetdesign/)

## Running 

### Locally

To run me locally install [boot2docker](http://boot2docker.io/).

Initialise your boot2docker and export shell variables

```bash
boot2docker init
boot2docker up
eval $(boot2docker shellinit)
```

Run the app with docker compose

```shell
docker-compose up
```

### On heroku

```bash
heroku create
heroku config:set CLOSE=100 # meters
heroku addons:create heroku-redis:hobby-dev
git push heroku master
```

### Variables

Following the principles of the [12 Factor App](12factor.net) we set parameters via environment variables. These can be set with ```heroku config:set SOMETHING=something``` or in the ```docker-compose.yml``` file for development.

The redis variables are set by docker compose linking the containers, or by the addon in heroku. You won't need to set them.

The port defaults to 3000 if not specified. Heroku will specify it for you, docker compose doesn't need you to set it.

#### Possible variables are

```shell
CLOSE=100 # distance to be considered close enough to steal in meters
PORT=3000 # port to run the application on (used by heroku, defaulted by us).
# Redis details
# set by heroku
REDIS_URL=username:password@host:3322
# or set by docker compose
REDIS_PORT_6379_TCP_PORT=6379 
REDIS_PORT_6379_TCP_ADDR=192.168.33.11
```

## Making requests

Replace the hostname and port here with whatever your IP actually is. To get the correct IP for boot2docker type ```boot2docker ip```

Heroku will run the app on port 80.


### Current position of the ball

```shell
$ curl http://192.168.59.103:3000/
{"lat":1,"lon":1}
```

* 200 if there is a position
* 204 if there is not

### Make a grab for the ball

```shell
$ curl -H "Content-Type: application/json" -X POST -d '{"lat":1.000008,"lon":1.000121}' http://192.168.59.103:3000/
{"lat":1,"lon":1,"key":"dFAWmkmHNAKjMBKNoOesJuQPudTjWncSYfWht8Zgcq1Sjdkgsd7WSc8oeI6qksirif95w6vef6JJNaSTzDT3slCHDIU87PNCB47"}
```
* 200 on success
* 409 if too far away
* Always succeeds if there currently is no ball

### Update the position of the ball

```shell
$ curl -H "Content-Type: application/json" -X POST -d '{"lat":1.000008,"lon":1.000121,"key":"dFAWmkmHNAKjMBKNoOesJuQPudTjWncSYfWht8Zgcq1Sjdkgsd7WSc8oeI6qksirif95w6vef6JJNaSTzDT3slCHDIU87PNCB47"}' http://192.168.59.103:3000/
{"lat":1,"lon":1,"key":"TAYQIqU4WCpjkoUKoxK25M65gOAfkMpPHKM2RnR32bkfStP4V2wNmaGvdfGzPT8LegWLR5yoplD"}
```

* 200 on success (but note new key)
* 403 on failure

## Technology

### Express
It's super fast to write prototypes in

### Redis
We're only storing a single value, so a keystore is probably appropriate.

### Docker

Who has time for full VMs these days

## Notes

### Code quality

Not bad but we're missing some tests due to this being produced in the middle of the night.
