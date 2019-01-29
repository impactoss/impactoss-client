![IMPACT OSS](homeGraphic.jpg?raw=true "IMPACT OSS")

## About IMPACT OSS

IMPACT OSS is an Open Source Software (OSS) for Integrated Management and Planning of Actions (IMPACT), created to assist States with coordinating and monitoring implementation of human rights and the Sustainable Development Goals (SDGs).

The IMPACT OSS project is maintained by the Impact Open Source Software Trust. To learn more about the project and the Trust see https://impactoss.org

#### System components

IMPACT OSS consists of a two principal components, this client-side application and a complementing server-side application

##### Client application ("the UI")
This client is a React JavaScript application and is a single page application that is responsible for:
* public User Interface (UI)
* admin UI

##### Server application ("the API")
The server is a Rails application and is a thin server that is responsible for:
* database management and access via an API (Application Programming Interface)
* user authentication
* automated email reminders

See https://github.com/impactoss/impactoss-server for the server-side application code

---

## Documentation

#### Configuration & Installation

The IMPACT OSS installation guide provides detailed instructions on how to configure and install both server and client applications:
https://install-guide.impactoss.org/

##### Try out client application

To quickly try out IMPACT OSS you can simply install the default demo configuration that uses the demo database of the demo server application:

1. Get the code: clone this repo using `git clone https://github.com/impactoss/impactoss-client.git`
2. Install dependencies: run `yarn`
3. Start development version: run `npm start` and see the IMPACT OSS at `http://localhost:3000`

#### User manuals

##### Admin Quick Start Guide

A collection of step by step guides for IMPACT OSS website administrators,
https://quick-start.impactoss.org/

##### User Manual

A detailed user manual for end users and website administrators
https://user-manual.impactoss.org/

---

## Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## Acknowledgement

This application was originally based on Max Stoiber's excellent `react-boilerplate`

https://www.reactboilerplate.com, https://github.com/react-boilerplate/react-boilerplate

#### `react-boilerplate` documentation

- [The Hitchhikers Guide to `react-boilerplate`](docs/general/introduction.md): An introduction for newcomers to this boilerplate.
- [Overview](docs/general): A short overview of the included tools
- [Commands](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.

---

## License

This project is licensed under the MIT license, see [LICENSE.md](LICENSE.md).
