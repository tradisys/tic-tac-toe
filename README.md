## Installation:

### Install libpng-dev for pngquant (need for webpack):
> $ [sudo] apt-get install --no-install-recommends gcc make libpng-dev

### Install other npm modules:
> $ npm i

### Build app:
> $ npm run build

### Other

### weinre - WEb INspector REmote.

Install
> $ [sudo] npm i [-g] weinre

To run
> $ weinre --boundHost 172.21.1.215 --httpPort 8080

To bound ip
> --boundHost 172.21.1.215

To bound port
> --httpPort 8080

Add in your index.html
```HTML
<script src="http://172.21.1.215:8080/target/target-script-min.js#anonymous"></script>
```
