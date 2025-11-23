# StreamBox - Test Credentials

## DummyJSON Authentication

Use these credentials to test login with the DummyJSON API:

### Valid Test Account

```
Username: emilys
Password: emilyspass
```

### How to Test

1. Open the app and navigate to Login screen
2. Enter the credentials above
3. Tap "Login"
4. You should be redirected to the Home screen with a valid token

### Alternative Test Accounts

You can find more test users at: https://dummyjson.com/users

Some examples:

- Username: `michaelw` / Password: `michaelwpass`
- Username: `sophiab` / Password: `sophiabpass`
- Username: `jamesd` / Password: `jamesdpass`

### Local Registration

You can also register a new account locally:

1. Go to Register screen
2. Create a username and password
3. The account is saved locally to AsyncStorage
4. Login works immediately with your new credentials

### API Documentation

- Auth Docs: https://dummyjson.com/docs/auth
- Users List: https://dummyjson.com/users
- Main Docs: https://dummyjson.com/docs

### Troubleshooting

If login fails:

1. Check Metro terminal logs for `[Auth]` messages showing request/response
2. Tap "Clear saved auth (dev)" button to reset local storage
3. Make sure credentials are typed exactly (case-sensitive)
4. Verify network connectivity

### Token Storage

- Tokens are stored in AsyncStorage under keys: `token` and `username`
- Use "Clear saved auth (dev)" button to reset
- On Android: Settings → Apps → Expo Go → Storage → Clear data
