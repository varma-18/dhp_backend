# DHP backend

## Local setup

- Create a `.env` file containing the following

  ```
    PORT = 4000
    NODE_ENV = development
    DB_USER = username
    DB_PASSWORD = password
    DB_DATABASE = db_name
    DB_HOST = localhost
    DB_DIALECTS = mysql
    SERVER_URL = http://localhost:4000
    TOKEN_KEY = token

    # --------GITHUB_OAUTH----------- #
    GITHUB_CLIENT_ID = id
    GITHUB_CLIENT_SECRET = secret
    GITHUB_AUTH_URL = https://github.com/login/oauth/authorize
    GITHUB_AUTH_TOKEN_URL = https://github.com/login/oauth/access_token
    GITHUB_AUTH_USER_URL = https://api.github.com/user


    # --------FACEBOOK_OAUTH----------- #
    FACEBOOK_APP_SECRET_PROD = prod_secret
    FACEBOOK_APP_ID_PROD = prod_id
    FACEBOOK_APP_SECRET_TEST = test_secret
    FACEBOOK_APP_ID_TEST = test_id
    FACEBOOK_AUTH_URL = https://www.facebook.com/v15.0/dialog/oauth
    FACEBOOK_AUTH_TOKEN_URL = https://graph.facebook.com/v15.0/oauth/access_token
    FACEBOOK_AUTH_USER_URL = https://graph.facebook.com/v15.0/me

    # --------GOOGLE_OAUTH----------- #
    GOOGLE_CLIENT_ID = id
    GOOGLE_CLIENT_SECRET = secret
    GOOGLE_AUTH_URL = https://accounts.google.com/o/oauth2/v2/auth
    GOOGLE_AUTH_TOKEN_URL = https://oauth2.googleapis.com/token
    GOOGLE_AUTH_USER_URL = https://www.googleapis.com/oauth2/v1/userinfo

    # --------OKTA_OAUTH----------- #
    OKTA_CLIENT_ID = id
    OKTA_CLIENT_SECRET = secret
    OKTA_AUTH_URL = https://<your-custom-domain>/oauth2/default/v1/authorize
    OKTA_AUTH_TOKEN_URL = https://<your-custom-domain>/oauth2/default/v1/token
    OKTA_AUTH_USER_URL = https://<your-custom-domain>/oauth2/default/v1/userinfo
    OKTA_AUTH_URL = https://org.okta.com/oauth2/default/v1/authorize
    OKTA_AUTH_TOKEN_URL = https://org.okta.com/oauth2/default/v1/token
    OKTA_AUTH_USER_URL = https://org.okta.com/api/v1/users

    #----------APP_LINKS--------#
    NUTRIPLAN_APP_DEEP_LINK= dhp://nutriplan.app
    PIVOT_APP_DEEP_LINK= dhp://pivot.app
    PIVOT_PORTAL_URL= http://localhost:3000

  ```

## Migrations and seeders

- ```
  npm run migrate
  ```
- ```
  npm run seed
  ```
