import { GOOGLE_AUTH_URI, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI_LOGIN, GOOGLE_REDIRECT_URI_SIGNUP } from "@/utils/env";

export async function googleAuth(from: "login" | "signup") {

    const code_verifier = crypto.randomUUID();

    sessionStorage.setItem('code_verifier', code_verifier);

    const code_challenge = await generateCodeChallenge(code_verifier);

    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: from === 'signup' ? GOOGLE_REDIRECT_URI_SIGNUP : GOOGLE_REDIRECT_URI_LOGIN,
        response_type: "code",
        scope: 'openid email profile',
        code_challenge,
        code_challenge_method: 'S256',

    });

    window.location.href = `${GOOGLE_AUTH_URI}?${params}`;
}



async function generateCodeChallenge(
    codeVerifier: string
) {
    const data = new TextEncoder().encode(codeVerifier);

    const digest = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const bytes = new Uint8Array(digest);

    const base64 = btoa(
        String.fromCharCode(...bytes)
    );

    return base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}





