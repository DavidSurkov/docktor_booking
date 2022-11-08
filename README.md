## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Description

Using Node.js, need to develop a service with an API to book a person for an appointment with a therapist.
The logic of the system should include the registration of a doctor,
the registration of a user, an appointment with a free doctor
(you cannot make an appointment with a doctor if he already has more than 3 appointments for today, an error will be returned when trying to make an appointment).

An appointment should be created, after which the doctor should accept or reject it.
If he accepts it, then we need to display this appointment in the appointments accepted by the doctor and in the user's appointments for the entire time,
if he rejects it, this appointment is deleted from the system. If the time of the created appointment is < current time,
then this appointment should be considered past and inactive.

## Alert service

We also need a service that will notify the user:
- 1 day before admission
- 2 hours before admission

Let the service itself simply log messages to a .log file:
_{{ current_date}} | Hi {{ user.name }}! We remind you that you are scheduled for {{ doctor.spec }} tomorrow at {{ date }}!
{{ current_date}} | Hi {{ user.name }}! You have 2 hours to go to {{ doctor.spec }} on {{ date }}!_

If something else is needed for the implementation (methods/collections/...anything),
then it is not forbidden to add it. Any error handling is required.

**Stack requirements:**
- Node.JS (Express\Nest);
- MongoDB;
- typescript;
- REST.