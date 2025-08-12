'use client'

import { useEffect } from 'react'
import { assetPath } from '@/lib/utils'

export default function FontLoader() {
  useEffect(() => {
    // Check if fonts are already loaded
    if (document.querySelector('#disket-mono-fonts')) {
      return
    }

    // Create style element with dynamic font paths
    const style = document.createElement('style')
    style.id = 'disket-mono-fonts'
    style.textContent = `
      @font-face {
        font-family: 'Disket Mono';
        src: url('${assetPath('/fonts/Disket-Mono-Regular.ttf')}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Disket Mono';
        src: url('${assetPath('/fonts/Disket-Mono-Bold.ttf')}') format('truetype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    `

    // Insert into document head
    document.head.appendChild(style)

    return () => {
      // Cleanup on unmount
      const existingStyle = document.querySelector('#disket-mono-fonts')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // This component renders nothing
  return null
}