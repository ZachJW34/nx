# dev-server

Serve a web application

Builder properties can be configured in workspace.json when defining the builder, or when invoking it.
Read more about how to use builders and the CLI here: https://nx.dev/react/guides/cli.

## Properties

### buildTarget

Type: `string`

Target which builds the application

### host

Default: `localhost`

Type: `string`

Host to listen on.

### liveReload

Default: `true`

Type: `boolean`

Whether to reload the page on change, using live-reload.

### open

Default: `false`

Type: `boolean`

Open the application in the browser.

### port

Default: `4200`

Type: `number`

Port to listen on.

### publicHost

Type: `string`

Public URL where the application will be served

### ssl

Default: `false`

Type: `boolean`

Serve using HTTPS.

### sslCert

Type: `string`

SSL certificate to use for serving HTTPS.

### sslKey

Type: `string`

SSL key to use for serving HTTPS.

### watch

Default: `true`

Type: `boolean`

Watches for changes and rebuilds application
