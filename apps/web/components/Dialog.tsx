"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

function Dialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div onClick={()=> setOpenDialog(true)}>
        {children}
      </div>


      {createPortal(
        <AnimatePresence>

          {
            openDialog && (

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className={cn(
                  "fixed inset-0 z-[9999]",
                  "flex items-center justify-center",
                  "bg-black/60 backdrop-blur-lg"
                )}
                onClick={() => setOpenDialog(false)}
              >
                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full max-w-md rounded-xl bg-background p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-semibold">
                    Login
                  </h2>

                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence>
        ,
        document.body
      )}

    </>
  );
}

export default Dialog;