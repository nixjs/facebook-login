declare global {
    interface Window {
        FB: any // 👈️ turn off type checking
        fbAsyncInit: () => void
    }
}

export namespace FacebookTypes {
    export type LoginStatus = 'authorization_expired' | 'connected' | 'not_authorized' | 'unknown'

    export interface InitParams {
        appId?: string | undefined
        version: string
        cookie?: boolean | undefined
        status?: boolean | undefined
        xfbml?: boolean | undefined
        frictionlessRequests?: boolean | undefined
        hideFlashCallback?: boolean | undefined
        autoLogAppEvents?: boolean | undefined
    }

    export interface LoginOptions {
        auth_type?: 'reauthenticate' | 'reauthorize' | 'rerequest' | undefined
        scope?: string | undefined
        return_scopes?: boolean | undefined
        enable_profile_selector?: boolean | undefined
        profile_selector_ids?: string | undefined
    }

    export interface StatusResponse {
        status: LoginStatus
        authResponse: AuthResponse
    }

    export interface AuthResponse {
        accessToken: string
        expiresIn: number
        signedRequest: string
        userID: string
        grantedScopes?: string | undefined
        reauthorize_required_in?: number | undefined
    }
}
