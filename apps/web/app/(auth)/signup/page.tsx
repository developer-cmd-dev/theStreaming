'use client'
import { AppName } from '@/components/Logo'
import {  HTTP_BACKEND_URL } from '@/utils/env'
import { axiosHandler, AxiosPayload } from '@repo/axios'
import { CustomError } from '@repo/customError'
import { CreateUserInput, createUserSchema, HttpResponse, PublicUser, userSchema, ZodError, } from '@repo/zod/schema'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { useSearchParams, useRouter } from 'next/navigation'
import { googleAuth } from '@/lib/oauth/googleOAuth'
import { userUserAuth } from '@/lib/zustandStore'
function Signup() {


  const [userCredential, setUserCredential] = useState<CreateUserInput>()

  const [errors, setErrors] = useState<{ for: string, message: string } | null>()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<{ for: "submitButton" | "googleAuthButton", isLoading: boolean }>()
  const searchParam = useSearchParams();
  const authCode = searchParam.get('code');
  const router = useRouter()
  const {setUserPaylod}=userUserAuth((state)=>state)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    setLoading({ for: 'submitButton', isLoading: true })
    e.preventDefault()

    const { data, error } = createUserSchema.safeParse(userCredential)

    if (error) {

      setErrors(null)
      if (error instanceof ZodError) {
        error._zod.def.map(err => {

          setErrors({
            for: err.path[0].toString(),
            message: err.message
          })

        })
      }
      setLoading({ for: "submitButton", isLoading: false })

      return
    }
    try {

      const payload: AxiosPayload = {
        url: HTTP_BACKEND_URL + '/signup',
        method: 'POST',
        data: userCredential
      }

      const response = await axiosHandler<HttpResponse<PublicUser>>(payload)

      setUserPaylod(response.data);
      setLoading({ for: "submitButton", isLoading: false })

    } catch (error) {
      if (error instanceof CustomError) {
        toast.add({
          type: 'error',
          description: error.message
        })
      }
      setLoading({ for: "submitButton", isLoading: false })
    }


  }




  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    setUserCredential((prev) => {
      return {
        email: name === "email" ? value : prev?.email ?? "",
        name: name === "name" ? value : prev?.name ?? "",
        password: name === "password" ? value : prev?.password ?? "",
        username: name === "username" ? value : prev?.username ?? "",
      };
    });
  }






  useEffect(() => {
    (async () => {
      if (!authCode) return;
      setLoading({ for: 'googleAuthButton', isLoading: true })


      const code_verifier = sessionStorage.getItem('code_verifier');

      if (!code_verifier) return

      const payload: AxiosPayload = {
        url: HTTP_BACKEND_URL + '/auth/google',
        method: "POST",
        data: {
          authCode,
          code_verifier,
          from:"signup"
        },
        withCredentials: true
      }


      try {
        const response = await axiosHandler<HttpResponse<PublicUser>>(payload);
      setUserPaylod(response.data);

        setLoading({ for: 'googleAuthButton', isLoading: false })

        router.push('/')
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.add({
            type: 'error',
            description: error.response?.data.message
          })
        }

        setLoading({ for: 'googleAuthButton', isLoading: false })

        return
      }

    })()


  }, [])



  return (
    <div className="w-full max-w-md mx-auto bg-surface-elevated rounded-lg shadow-lg p-8 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-center text-text-primary mb-2">
        Sign up for <AppName />
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">


        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm text-text-secondary font-medium">
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Enter your name'
            autoComplete='name'
            className="rounded-lg border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30"
            required
            onChange={handleChange}
          />
        </div>



        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm text-text-secondary font-medium">
            Usernname
          </label>
          <input
            type='text'
            id='username'
            name='username'
            placeholder='Enter Username'
            autoComplete='username'
            className="rounded-lg border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30"
            required
            onChange={handleChange}

          />


          {errors?.for === 'useranme' && (<label htmlFor="username" className="text-sm text-red-400 font-medium">
            {errors.message}
          </label>)}

        </div>


        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-text-secondary font-medium">
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            autoComplete='email'
            className="rounded-lg border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30"
            required
            onChange={handleChange}
          />
        </div>


        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-text-secondary font-medium">
            Password
          </label>
          <div className="relative ">
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              placeholder='Enter your password'
              autoComplete='new-password'
              className="rounded-lg w-full border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 pr-10"
              required
              onChange={handleChange}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-2 flex items-center text-sm text-text-muted"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off SVG
                <IconEye />
              ) : (
                // Eye SVG
                <IconEyeOff />
              )}
            </button>


          </div>

          {errors?.for === 'password' && (<label htmlFor="password" className="text-sm text-red-400 font-medium">
            {errors.message}
          </label>)}
        </div>




        <button
          type="submit"
          className="mt-2 rounded-md bg-brand text-brand-foreground py-2 font-semibold hover:bg-brand/80 transition-colors flex items-center justify-center"
        >
          {loading?.for === 'submitButton' && loading.isLoading ? <Spinner className='size-6' /> : "Sign Up"}
        </button>
      </form>
      <div className="flex items-center gap-2 mt-2">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">OR</span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-border bg-background text-text-primary font-medium py-2 hover:bg-surface transition-colors"
          onClick={() => googleAuth("signup")}
        >

          {loading?.for === 'googleAuthButton' && loading.isLoading ? <Spinner className='size-6' /> : <> <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" fill="none">
            <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.1C34.7 32 30 35.5 24 35.5 16.6 35.5 10.5 29.4 10.5 22S16.6 8.5 24 8.5c3.1 0 5.9 1.1 8 2.9l6-5.8C34.7 2.4 29.6 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c12.5 0 23-9.1 23.9-21.2.1-.8.1-1.5.1-2.3 0-1.6-.2-3.2-.4-4.7z" />
              <path fill="#34A853" d="M6.3 14.2l6.6 4.8C14.8 16.2 19 13 24 13c3.1 0 5.9 1.1 8 2.9l6-5.8C34.7 2.4 29.6 0 24 0 15.3 0 7.7 5.7 4 14.2z" />
              <path fill="#FBBC05" d="M24 48c6.2 0 11.9-2.1 16.2-5.8l-7.6-6.2C29.1 38.7 26.7 39.5 24 39.5c-6.1 0-11.3-3.9-13.2-9.3l-7.7 6C7.6 44.3 15.3 48 24 48z" />
              <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.1c-1.6 4.3-5.5 7.5-11.1 7.5-6.1 0-11.3-3.9-13.2-9.3l-7.7 6C7.6 44.3 15.3 48 24 48c12.5 0 23-9.1 23.9-21.2.1-.8.1-1.5.1-2.3 0-1.6-.2-3.2-.4-4.7z" />
            </g>
          </svg>
            Continue with Google</>}


        </button>

      </div>
      <p className="text-xs text-center text-text-secondary mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-brand underline hover:no-underline">
          Log in
        </a>
      </p>
    </div>
  )
}

export default Signup






type fields = "name" | "email" | "username" | "password"

const signupFormData = [
  {
    id: "name",
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
    minLength: 1,
    autocomplete: "name",
  },
  {
    id: "email",
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    autocomplete: "email",
  },
  {
    id: "username",
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Choose a username",
    required: true,
    minLength: 3,
    maxLength: 15,
    pattern: "^[a-zA-Z0-9_]+$",
    autocomplete: "username",
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create a password",
    required: true,
    minLength: 8,
    autocomplete: "new-password",
  },
];


