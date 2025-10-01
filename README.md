# Meedio frontend

Meedio front end repository

- [Live demo](https://connect.meedio.eu/)
- [Meedio.eu enterprise demo](https://meedio.eu/)

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

## Start instructions

Install npm packages

```bash
yarn
npm i -g lefthook # To be able to create commits
```

VPN
Connecting to the backend server requires a VPN. To get it, ask @arnasledev.

## Applications

- meedio-connect

## Environments

- local
- dev
- stag
- prod

## Server start instructions

```bash
yarn <environment>
```

\*[environments](#environments) \*[app-name](#applications)

## Run E2E Playwright tests

1. Start server: [instructions](#server-start-instructions)
2. Run playwright

```bash
yarn <environment>:play
```

P.S. playwright should be installed locally before these actions, you can accomplish that with `yarn playwright install`

\*[environments](#environments)

`--debug` to run in debug mode
`--headed` to run in headed mode
`--repeat-each=<number>` to run tests multiple times

## Build and serve instructions

Build project

```bash
yarn build
```

Serve project

```bash
npm install -g serve
npx import-meta-env -x deployment.env -e .env.<environment>
serve -s build
```

\*[app-name](#applications)

## New environment variable creation

If you want to create new environment variable, you should also need to include it to `deployment.env` file and all other .env files.

## Storybook instructions

Start storybook

```bash
yarn storybook
```

## Meedio-Connect and Livekit JWT service

Meedio-Connect requires a Livekit SFU behind a Livekit JWT service to work. The url to the Livekit jwt service can be configured by your homeserver via the `.well-known`. This app fetches the supported Livekit services JWT as defined in [MSC4158](https://github.com/matrix-org/matrix-spec-proposals/pull/4158). In short, `https://<matrix_homeserver env var>/.well-known/matrix/client` must contain the data as described below. If `.well-known` does not provide Livekit JWT services the application will make focus from env variables (`REACT_APP_LIVEKIT_SERVER_URL`, `REACT_APP_LIVEKIT_SERVICE_URL`)

The configuration is a list of Focus configs:

```json
"org.matrix.msc4143.rtc_foci": [
    {
        "type": "livekit",
        "livekit_service_url": "https://someurl.com"
    },
     {
        "type": "livekit",
        "livekit_service_url": "https://livekit2.com"
    },
    {
        "type": "another_foci",
        "props_for_another_foci": "val"
    },
]
```
