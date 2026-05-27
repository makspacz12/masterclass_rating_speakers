'use client'

import { motion } from 'framer-motion'
import * as React from 'react'

/**
 * Delikatne, spokojne odsłanianie treści przy przewijaniu w dół
 * (fade + lekki ruch w górę). Używane dla kolejnych kart z pytaniami.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
