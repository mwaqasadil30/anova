# TypeScript Client for OpenAPI/Swagger

This front-end repo is currently using NSwag to generate a TypeScript + Axios client from the backend C# API's swagger document.

This has been extremely useful for frontend development since we get:

- TypeScript enums matching what the backend uses (for example: DataChannelTypeEnum)
- Typed API requests and responses
- We can see a diff of any changes made to the backend APIs

Note that the swagger document is now protected via an API key which is required to access the document.
The API key is passed in via a query parameter to the URL `?SwaggerApiKey=KEY_HERE`

See this ticket for more details: https://dev.azure.com/anovateam/Evolve/_boards/board/t/Evolve%20Team/Stories/?workitem=31622

## Pre-requisites

- Install [Docker](https://www.docker.com/get-started)
- Obtain the Swagger API Key required to authenticate and download the swagger document
  - Ask an existing backend/frontend developer for this

1. Create a `.env` file within the `generate-api` directory with the following (make sure to replace `insert_key_here` with the actual key):

```
SWAGGER_API_KEY=insert_key_here
```

## Generating the TypeScript Client

1. Make sure you're in this directory `Anova.Evolve.Admin.Frontend/generate-api`

2. Run the command below to ensure the `SWAGGER_API_KEY` env variable is set

```bash
source .env
```

3. Then do the following:

```bash
# Make sure you're in this directory (Anova.Evolve.Admin.Frontend/generate-api)
# before running the following commands

# 1. Generate the TypeScript client code using the nswag.json
#    file in this directory
docker build --build-arg SWAGGER_API_KEY=$SWAGGER_API_KEY --no-cache -t anova-admin-nswag-api .

# 2. Copy the generated TypeScript client code from docker
#    to your local machine
docker run --rm anova-admin-nswag-api > ../frontend/src/api/admin/api.ts
```

## Notes

The `nswag.json` file in this directory contains the settings that have been used to generate the code. Some key configuration arguments include:

- `documentGenerator.fromDocument.url`
  - The `swagger.json` URL to build the TypeScript client from
- `codeGenerators.openApiToTypeScriptClient.output`
  - The output filepath within Docker for the generated TypeScript client code

## Resources

- [NSwag Command Line docs](https://github.com/RicoSuter/NSwag/wiki/CommandLine)
