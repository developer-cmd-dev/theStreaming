'use client'
import { AppName } from '@/components/Logo'
import { CreateUserInput, createUserSchema, userSchema, z, ZodError } from '@repo/zod/schema'
import { IconEye, IconEyeOff, IconEyeUp } from '@tabler/icons-react'
import React, { ChangeEventHandler, useState } from 'react'
function Signup() {


  const [userCredential, setUserCredential] = useState<CreateUserInput>()

  const [errors, setErrors] = useState<{ for: 'password' | 'username', message: string }>()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      




    } catch (error) {
      
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
        </div>


        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm text-text-secondary font-medium">
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
          className="mt-2 rounded-md bg-brand text-brand-foreground py-2 font-semibold hover:bg-brand/80 transition-colors"
        >
          Sign Up
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
        // onClick={/* your OAuth handler, e.g., signIn('google') */}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" fill="none">
            <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.1C34.7 32 30 35.5 24 35.5 16.6 35.5 10.5 29.4 10.5 22S16.6 8.5 24 8.5c3.1 0 5.9 1.1 8 2.9l6-5.8C34.7 2.4 29.6 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c12.5 0 23-9.1 23.9-21.2.1-.8.1-1.5.1-2.3 0-1.6-.2-3.2-.4-4.7z" />
              <path fill="#34A853" d="M6.3 14.2l6.6 4.8C14.8 16.2 19 13 24 13c3.1 0 5.9 1.1 8 2.9l6-5.8C34.7 2.4 29.6 0 24 0 15.3 0 7.7 5.7 4 14.2z" />
              <path fill="#FBBC05" d="M24 48c6.2 0 11.9-2.1 16.2-5.8l-7.6-6.2C29.1 38.7 26.7 39.5 24 39.5c-6.1 0-11.3-3.9-13.2-9.3l-7.7 6C7.6 44.3 15.3 48 24 48z" />
              <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.1c-1.6 4.3-5.5 7.5-11.1 7.5-6.1 0-11.3-3.9-13.2-9.3l-7.7 6C7.6 44.3 15.3 48 24 48c12.5 0 23-9.1 23.9-21.2.1-.8.1-1.5.1-2.3 0-1.6-.2-3.2-.4-4.7z" />
            </g>
          </svg>
          Continue with Google
        </button>
        {/* <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-border bg-background text-text-primary font-medium py-2 hover:bg-surface transition-colors"
        >
          <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.615 0 8.084c0 3.577 2.292 6.605 5.471 7.672.4.074.547-.176.547-.39 0-.192-.007-.7-.011-1.373-2.226.492-2.695-1.077-2.695-1.077-.364-.938-.89-1.188-.89-1.188-.726-.5.055-.49.055-.49.803.057 1.226.832 1.226.832.713 1.235 1.872.879 2.329.673.072-.523.28-.879.508-1.082-1.777-.205-3.645-.911-3.645-4.055 0-.895.317-1.626.833-2.2-.081-.205-.361-1.028.077-2.143 0 0 .675-.221 2.215.84A7.6 7.6 0 018 4.847c.684.003 1.374.092 2.017.27 1.539-1.062 2.214-.84 2.214-.84.439 1.115.159 1.938.078 2.143.518.574.832 1.305.832 2.2 0 3.153-1.871 3.847-3.653 4.048.287.25.543.735.543 1.482 0 1.071-.01 1.932-.01 2.195 0 .217.146.467.55.388C13.71 14.685 16 11.657 16 8.084 16 3.615 12.42 0 8 0" />
          </svg>
          Continue with GitHub
        </button> */}
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