# @nixjs23n6/facebook-login

A Component React for Facebook Login

## Quick Setup

### Install

Install these dependencies:

`yarn add @nixjs23n6/facebook-login`

### Setup & Usage

```typescript
import { Sdk, useInitFacebook } from '@nixjs23n6/facebook-login'

interface LoginPropArg {}

export const Login: React.FC<LoginPropArg> = () => {
    useInitFacebook({
        version: 'v11.0',
        appId: __FACEBOOK_APP_ID__
    })

    const onLogin = () => {
        Sdk.login({
            scope: 'public_profile,email'
        })
        .then(console.log)
        .catch(console.log)
    }

    return (<button onClick={() => onLogin()}>Login with facebook</button>)
}
```
