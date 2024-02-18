# Open Enterprise Application runner

Simple repository to start the OEA + mediator in localhost environment 

# How to use

## Prism mediator

```bash
cd prism-mediator
./run.sh
```

## Roots mediator (deprecated)

```bash
cd roots-mediator
./run.sh
```

## Environment

There are some environment variables to setup the environment

| Variable | Description   | Default value |
|----------|---------------|---------------|
| PPORT    | OEA port      | 8090          |
| MPORT    | Mediator port | 8080          |
| DCPORT   | Didcomm port  | 8081          |

## .env

Defines the versions of products

## update_env.sh (requires additional setup)

Updates the versions of the products to latest

Setup the helpers [here](https://github.com/hyperledger-labs/open-enterprise-agent/tree/main/infrastructure/utils/python/github-helpers)
