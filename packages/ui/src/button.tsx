import React from 'react'


interface Props{
children:React.ReactNode;
size:Size
}


type Size = {
    sm:``
}



function Button({children}:Props) {
  return (
    <button className={``}>{children}</button>
  )
}

export default Button