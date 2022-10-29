import React from 'react'
import { initSdk } from './sdk'
import { FacebookTypes } from './types'

export const useInitFacebook = (options: FacebookTypes.InitParams) => {
    React.useEffect(() => {
        initSdk({
            cookie: true,
            xfbml: true,
            autoLogAppEvents: true,
            ...options
        }).then((res) => console.log('%cFacebook state', 'color: blue; font-size: 16px;', res))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
