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

#### src/firebaseBase.js content

Your firebase config file should look like this

```
const firebaseConfig = {
 ...Your firebase api keys here
};

export default firebaseConfig;
```


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

### Tips: 
* Remember to update the athentication signin methods on firebase
* For a quick total refresh go to the /logout url


### Todos
* Fix mobile responsive view
* Add media sharing
* Add profile edits page
* Remove unused packages causing high overheads during deployment

### Bugs
* Correct homepage redirect after login
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



