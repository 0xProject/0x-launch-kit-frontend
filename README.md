# 0x-launch-kit-frontend

The project was bootstraped using [`create-react-app`](https://github.com/facebook/create-react-app), but the development server will listen for incoming requests on port `3001`. The configuration proxies `'^/api'` requests to a running instance of `0x-launch-kit` on port `3000`.

To lunch the development server execute the following:

```
$ git clone https://github.com/0xProject/0x-launch-kit
$ cd 0x-launch-kit-frontend
$ yarn
$ yarn start
```

To start a [`0x-launch-kit`](https://github.com/0xProject/0x-launch-kit) instance, head to its GitHub page, clone the repository and follow the corresponding instructions.
