# todo-api-rails-front-nuxtjs-sample

Nuxt.jsを使用したAPIを利用するサンプルです。
APIは https://github.com/greendrop/todo-api-rails-sample を使用します。

## セットアップ

```shell
$ git clone git@github.com:greendrop/todo-api-rails-front-nuxtjs-sample.git
$ cd todo-api-rails-front-nuxtjs-sample
$ vi .envrc
$ direnv allow
$ docker-compose pull
$ docker-compose build
$ docker-compose run --rm front bash
$ cp .env.example .env
$ yarn install
$ exit
$ docker-compose up
```

### .envrc

```
export USER_ID=`id -u`
export GROUP_ID=`id -g`
```
