import { axiosHandler, AxiosPayload } from "@repo/axios";


export async function oAuthAuthorization(whichOAuth: "google" | "facebook") {

    try {


        const payload: AxiosPayload = {
            method: "GET",
            url: "https://accounts.google.com/v3/signin/accountchooser?access_type=offline&client_id=407408718192.apps.googleusercontent.com&prompt=consent&redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&dsh=S-1523114049%3A1787562194990423&o2v=2&service=lso&flowName=GeneralOAuthFlow&opparams=%253F&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPRSZQzq45ePtiNJEulKmkrBYiegQfsPpX86Dbl-pG2D8scbPZ3xFz_gNR31A6m5BPZ2TITXtQ7aFM1rS646atY-yL9mr9U1TIQqDfWrKELMXmFxi855W2XjMIn6tVtZt0OV46wQxVp7jhKI3fmXtFtfV_L0C2kFlADd4VKUerJGZJn5ofVHdq6kpq-1J5pb6HMTYuUTltFwOprGUXPsQqKmL9vQLjNszT3pdAolZxtDGIWEbExzH2KE-0PmgLTuEi_yiTNHthNvD04tbwxn5AbxQhmHN4gHRJTnaovLMKi9taU8rYWG_7f7IZpmrVqFWWX3hz3-7SGT7qS2oIjaUWUBuDJaDIhE_6uz28keP_vWFlXNt5adt0ioxHp12QSekm40v31aJgB7Xtb7DWGxOqUMptUXkgYCth9XWq3zXWz7g1tUW2GPOqZMacZHoUUoOO2A0ma%26flowName%3DGeneralOAuthFlow%26as%3DS-1523114049%253A1787562194990423%26client_id%3D407408718192.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fdevelopers.google.com",
        }



     const respone = await   axiosHandler(payload)


     console.log(respone)



    } catch (error) {
        console.log(error)
    }



}