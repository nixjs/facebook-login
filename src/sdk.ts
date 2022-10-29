// https://developers.facebook.com/docs/apps/versions/
// https://developers.facebook.com/docs/javascript/quickstart/
// https://developers.facebook.com/docs/javascript/reference/
// https://developers.facebook.com/docs/javascript/reference/FB.init/
// https://stackoverflow.com/questions/43445301/access-token-warning-when-logging-in-using-facebook-javascript-sdk
import { FacebookTypes } from './types'
export const FACEBOOK_SCRIPT_ID = 'facebook-jssdk'
export const INIT_TIMEOUT = 3000

function handleLoadError(error: any) {
    // eslint-disable-next-line no-console
    console.error(new URIError(`the script ${error.target.src} didn't load correctly.`))
}

// https://develop`e`r.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
// prettier-ignore
export function initSdk(options: FacebookTypes.InitParams, locale = 'en_US') {
    return new Promise((resolve, reject) => {
        // https://developers.facebook.com/docs/javascript/advanced-setup
        window.fbAsyncInit = function () {
            window.FB.init(options)
            resolve(window.FB)
        };
        (function (d, s, id) {
            const fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) { return; }
            const js = d.createElement(s); js.id = id as any
            (js as any).src = `//connect.facebook.net/${locale}/sdk.js`
            js.onerror = error => { handleLoadError(error); reject(error) } // non-facebook line
            (fjs as any).parentNode.insertBefore(js, fjs)
        }(document, 'script', FACEBOOK_SCRIPT_ID))
        /* eslint-enable */
        window.setTimeout(() => reject('window.fbAsyncInit timed out, see: https://developers.facebook.com/support/bugs/'), INIT_TIMEOUT)
    })
}

export function removeScript() {
    return new Promise((resolve) => {
        const script = document.getElementById(FACEBOOK_SCRIPT_ID)
        if (script) script.remove()
        window.setTimeout(resolve)
    })
}

export class Sdk {
    static state = Object.seal({ isExternal: false, pending: null, consumers: 0 })
    static async _init(options: FacebookTypes.InitParams, locale: string) {
        if (Sdk.state.isExternal) return window.FB
        if (window.FB) {
            Sdk.state.isExternal = true
            return window.FB
        }
        if (Sdk.state.pending) return Sdk.state.pending
        console.log('%cinit facebook sdk', 'color: green; font-size: 24px;')
        Sdk.state.pending = initSdk(options, locale) as any
        return Sdk.state.pending
    }

    static reset() {
        Sdk.state.consumers = 0
        Sdk.state.pending = null
        Sdk.state.isExternal = false
    }

    static subscribe(...args: [FacebookTypes.InitParams, string]) {
        Sdk.state.consumers++
        return Sdk._init(...args)
    }

    static async unsubscribe() {
        Sdk.state.consumers--
        if (Sdk.state.isExternal || Sdk.state.consumers) return
        Sdk.reset()
        return removeScript()
    }

    static isConnected(status: FacebookTypes.LoginStatus) {
        return status === 'connected'
    }

    static isDisconnected(status: FacebookTypes.LoginStatus) {
        return !Sdk.isConnected(status)
    }

    /**
     * FB.getLoginStatus() allows you to determine if a user is
     * logged in to Facebook and has authenticated your app.
     *
     * @param roundtrip force a roundtrip to Facebook - effectively refreshing the cache of the response object
     */
    static getLoginStatus(roundtrip?: boolean) {
        return new Promise((resolve) => window.FB.getLoginStatus(resolve, roundtrip))
    }

    /**
     * Use this function to log the user in
     *
     * Calling FB.login() results in the JS SDK attempting to open a popup window.
     * As such, this method should only be called after a user click event, otherwise
     * the popup window will be blocked by most browsers.
     * @param options optional ILoginOption to add params such as scope.
     */

    static login(options?: FacebookTypes.LoginOptions): Promise<FacebookTypes.StatusResponse> {
        return new Promise((resolve) => window.FB.login(resolve, options))
    }

    /**
     * The method FB.logout() logs the user out of your site and, in some cases, Facebook.
     */
    static logout(): Promise<FacebookTypes.StatusResponse> {
        return new Promise((resolve) => window.FB.logout(resolve))
    }
}
