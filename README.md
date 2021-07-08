# firechat-vue

## Project setup

### Addintional configuratins

Go to [firebase](https://console.firebase.google.com/) , setup your app and access permisions.

```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
      "accounts":{
      ".indexOn": ["display", "uid"]
    }
  }
}

```

Save and copy your web configuration to src/firebaseConfig.js. The dummy config file would probablly be decommissioned by the time you want to run.


### Setup node and build
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

N. B. For a quick total refresh go to the /logout url

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



