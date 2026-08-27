import React from 'react'
import {motion} from 'motion/react'
function Spinner() {
  return (
  <div className="flex justify-center items-center">
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full"
    />
  </div>
  )
}

export default Spinner