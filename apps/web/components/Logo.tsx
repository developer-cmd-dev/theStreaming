import React from 'react'

function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-lg bg-brand">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
          fill="#0D0D0F"
          stroke="#0D0D0F"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <AppName/>
  </a>
  )
}

export default Logo


export function AppName (){
  return(
    <span className="hidden text-2xl font-bold tracking-tight sm:inline">
    Aim<span className="text-brand">Dot</span>
  </span>
  )
}