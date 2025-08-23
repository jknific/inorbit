'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import { assetPath } from '@/lib/utils'

interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

interface InteractiveFloppyDiskProps {
  fusionMode?: boolean
  onEjectChange?: (isEjected: boolean) => void
  isEjected?: boolean
  onDropZoneChange?: (show: boolean, isOver: boolean) => void
  onInsertDisk?: () => void
}

export interface InteractiveFloppyDiskRef {
  insertDisk: () => void
}

const InteractiveFloppyDisk = forwardRef<InteractiveFloppyDiskRef, InteractiveFloppyDiskProps>(({ fusionMode, onEjectChange, isEjected: externalIsEjected, onDropZoneChange, onInsertDisk }, ref) => {
  const diskRef = useRef<HTMLDivElement>(null)
  const staticDiskRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const rewindSfxRef = useRef<HTMLAudioElement>(null)
  const pauseSfxRef = useRef<HTMLAudioElement>(null)
  const ejectSfxRef = useRef<HTMLAudioElement>(null)
  const blip1Ref = useRef<HTMLAudioElement>(null)
  const blip2Ref = useRef<HTMLAudioElement>(null)
  const blip3Ref = useRef<HTMLAudioElement>(null)
  const blip4Ref = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const velocityRef = useRef<Velocity>({ x: 0, y: 0 })
  const rotationRef = useRef(0)
  const positionRef = useRef<Position>({ x: 0, y: 0 })
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isEjected, setIsEjected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHandIcon, setShowHandIcon] = useState(false)

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    insertDisk: handleReturnDisk
  }))

  // Sync with external state
  useEffect(() => {
    if (externalIsEjected !== undefined && externalIsEjected !== isEjected) {
      setIsEjected(externalIsEjected)
      if (!externalIsEjected) {
        // Reset physics when returning to static state
        velocityRef.current = { x: 0, y: 0 }
        rotationRef.current = 0
        setIsGrabbing(false)
      }
    }
  }, [externalIsEjected, isEjected])

  // Detect mobile viewport for sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile() // Initial check
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Maintain disk position when fusion mode changes
  useEffect(() => {
    if (isEjected && diskRef.current && !isDraggingRef.current) {
      // Re-apply the current position to ensure disk stays in place
      const disk = diskRef.current
      disk.style.transform = `translate(${positionRef.current.x - 150}px, ${positionRef.current.y - 150}px) rotate(${rotationRef.current}deg)`
    }
  }, [fusionMode, isEjected])

  const handleEjectDisk = () => {
    if (!isEjected) {
      // Play eject sound effect
      if (ejectSfxRef.current) {
        ejectSfxRef.current.currentTime = 0
        ejectSfxRef.current.play()
      }
      
      // Pause the main track if playing
      if (audioRef.current && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      
      setIsEjected(true)
      onEjectChange?.(true)
      
      // Show drop zone immediately when ejected
      onDropZoneChange?.(true, false)
      
      // Show hand icon after a short delay, then hide it
      setTimeout(() => {
        setShowHandIcon(true)
        // Hide hand icon after 3 seconds
        setTimeout(() => {
          setShowHandIcon(false)
        }, 3000)
      }, 500)
      
      // Initialize position from static disk position
      const staticDisk = staticDiskRef.current
      if (staticDisk) {
        const rect = staticDisk.getBoundingClientRect()
        
        positionRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
        
        // Give it a small initial eject velocity
        velocityRef.current = {
          x: (Math.random() - 0.5) * 8,
          y: -3 - Math.random() * 3
        }
        rotationRef.current = -3 // Start with slight rotation like in original
      }
    }
  }

  const playRandomBlip = () => {
    const blipRefs = [blip1Ref, blip2Ref, blip3Ref, blip4Ref]
    const randomBlip = blipRefs[Math.floor(Math.random() * blipRefs.length)]
    
    if (randomBlip.current) {
      randomBlip.current.currentTime = 0
      randomBlip.current.play().catch(() => {
        // Ignore audio play errors (e.g., if user hasn't interacted with page yet)
      })
    }
  }

  const handleReturnDisk = () => {
    if (isEjected) {
      // Play eject sound effect (same sound for inserting)
      if (ejectSfxRef.current) {
        ejectSfxRef.current.currentTime = 0
        ejectSfxRef.current.play()
      }
      
      setIsEjected(false)
      onEjectChange?.(false)
      onInsertDisk?.() // Notify parent that disk was inserted
      // Reset physics
      velocityRef.current = { x: 0, y: 0 }
      rotationRef.current = 0
      setIsGrabbing(false)
    }
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    // Play pause sound effect
    if (pauseSfxRef.current) {
      pauseSfxRef.current.currentTime = 0
      pauseSfxRef.current.play()
    }
    
    // Pause the main track (preserves current time)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleRewind = () => {
    // Play rewind sound effect
    if (rewindSfxRef.current) {
      rewindSfxRef.current.currentTime = 0
      rewindSfxRef.current.play()
    }
    
    // Pause if currently playing, then rewind
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      audioRef.current.currentTime = 0
    }
  }

  // Handle audio ended event
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => setIsPlaying(false)
      audio.addEventListener('ended', handleEnded)
      return () => audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    // Early return if not ejected, but still provide cleanup
    if (!isEjected) {
      return () => {
        // Cleanup function even when not ejected
      }
    }
    
    const disk = diskRef.current
    if (!disk) {
      return () => {
        // Cleanup function even when disk doesn't exist
      }
    }

    // Physics constants
    const FRICTION = 0.985 // Air resistance
    const BOUNCE_DAMPING = 0.7 // Energy lost on bounce
    const MIN_VELOCITY = 0.1 // Threshold to stop movement
    const ROTATION_FACTOR = 0.5 // How much rotation per velocity unit
    const MAX_VELOCITY = 30 // Cap maximum velocity

    // Track mouse velocity for throwing
    const velocityHistory: Position[] = []
    let lastMouseTime = Date.now()

    const handleMouseDown = (e: MouseEvent | Touch) => {
      // Since listener is on disk element, we know the click is on the disk
      isDraggingRef.current = true
      setIsGrabbing(true)
      // Hide hand icon when user starts dragging
      setShowHandIcon(false)
      // Show insert icon when dragging starts
      onDropZoneChange?.(true, false) // Show drop zone, not over
      
      dragStartRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y
      }
      
      // Reset velocity when grabbing
      velocityRef.current = { x: 0, y: 0 }
      velocityHistory.length = 0
      lastMouseTime = Date.now()
      
      // Prevent text selection (only if it's a real MouseEvent with preventDefault)
      if ('preventDefault' in e && typeof e.preventDefault === 'function') {
        e.preventDefault()
      }
    }

    const checkDropZone = (x: number, y: number) => {
      // Check if disk is over the insert icon in top-right
      const iconSize = 60
      const iconMargin = 20
      const dropZoneLeft = window.innerWidth - iconSize - iconMargin
      const dropZoneRight = window.innerWidth - iconMargin
      const dropZoneTop = iconMargin
      const dropZoneBottom = iconMargin + iconSize
      
      const isInDropZone = x >= dropZoneLeft && x <= dropZoneRight && 
                          y >= dropZoneTop && y <= dropZoneBottom
      
      // setIsOverDropZone(isInDropZone)
      onDropZoneChange?.(true, isInDropZone) // Update parent with over state
      return isInDropZone
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const currentTime = Date.now()
      const dt = currentTime - lastMouseTime
      
      if (dt > 0) {
        // Calculate instantaneous velocity
        const newPos = {
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        }
        
        const velocity = {
          x: (newPos.x - positionRef.current.x) / dt * 16, // Convert to ~60fps units
          y: (newPos.y - positionRef.current.y) / dt * 16
        }
        
        // Keep history of recent velocities for smooth throwing
        velocityHistory.push(velocity)
        if (velocityHistory.length > 5) {
          velocityHistory.shift()
        }
        
        positionRef.current = newPos
        lastMouseTime = currentTime

        // Check if dragging over drop zone
        checkDropZone(e.clientX, e.clientY)
      }

      // Update visual position while dragging
      disk.style.transform = `translate(${positionRef.current.x - 150}px, ${positionRef.current.y - 150}px) rotate(${rotationRef.current}deg)`
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      
      isDraggingRef.current = false
      setIsGrabbing(false)
      // Hide insert icon when dragging ends
      onDropZoneChange?.(false, false) // Hide drop zone
      
      // Check if released over drop zone
      const isInDropZone = checkDropZone(e.clientX, e.clientY)
      // Always clear drop zone highlight on release
      
      if (isInDropZone) {
        // Insert disk immediately if dropped in zone
        handleReturnDisk()
        onDropZoneChange?.(false, false) // Hide drop zone after successful drop
        return
      }
      
      // Calculate throw velocity from recent movement history
      if (velocityHistory.length > 0) {
        const avgVelocity = velocityHistory.reduce(
          (acc, vel) => ({ x: acc.x + vel.x, y: acc.y + vel.y }),
          { x: 0, y: 0 }
        )
        
        velocityRef.current = {
          x: Math.min(Math.max(avgVelocity.x / velocityHistory.length, -MAX_VELOCITY), MAX_VELOCITY),
          y: Math.min(Math.max(avgVelocity.y / velocityHistory.length, -MAX_VELOCITY), MAX_VELOCITY)
        }
      }
    }


    // Physics animation loop
    const animate = () => {
      if (!isDraggingRef.current) {
        // Apply physics only when not dragging
        if (Math.abs(velocityRef.current.x) > MIN_VELOCITY || 
            Math.abs(velocityRef.current.y) > MIN_VELOCITY) {
          
          // Update position
          positionRef.current.x += velocityRef.current.x
          positionRef.current.y += velocityRef.current.y
          
          // Get boundaries (with some padding for the disk size)
          const diskRadius = isMobile ? 100 : 150 // Smaller radius on mobile
          const minX = diskRadius
          const maxX = window.innerWidth - diskRadius
          const minY = diskRadius
          const maxY = window.innerHeight - diskRadius
          
          // Bounce off walls
          if (positionRef.current.x <= minX || positionRef.current.x >= maxX) {
            velocityRef.current.x *= -BOUNCE_DAMPING
            positionRef.current.x = positionRef.current.x <= minX ? minX : maxX
            
            // Play random blip sound on bounce
            playRandomBlip()
            
            // Add some spin on bounce
            rotationRef.current += velocityRef.current.y * 2
          }
          
          if (positionRef.current.y <= minY || positionRef.current.y >= maxY) {
            velocityRef.current.y *= -BOUNCE_DAMPING
            positionRef.current.y = positionRef.current.y <= minY ? minY : maxY
            
            // Play random blip sound on bounce
            playRandomBlip()
            
            // Add some spin on bounce
            rotationRef.current += velocityRef.current.x * 2
          }
          
          // Apply friction
          velocityRef.current.x *= FRICTION
          velocityRef.current.y *= FRICTION
          
          // Update rotation based on velocity (air hockey puck spin)
          const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2)
          rotationRef.current += speed * ROTATION_FACTOR
          
          // Update visual position
          disk.style.transform = `translate(${positionRef.current.x - 150}px, ${positionRef.current.y - 150}px) rotate(${rotationRef.current}deg)`
        } else {
          // Stop tiny movements
          velocityRef.current = { x: 0, y: 0 }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation loop
    animate()

    // Wrapper functions to only handle events when dragging
    function handleGlobalMouseMove(e: MouseEvent) {
      if (isDraggingRef.current) {
        handleMouseMove(e)
      }
    }
    
    function handleGlobalMouseUp(e: MouseEvent) {
      if (isDraggingRef.current) {
        handleMouseUp(e)
      }
    }

    // Mouse events for desktop
    disk.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true })
    
    // Touch events for mobile VHS dragging
    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0]
      handleMouseDown(touch)
    }
    
    function handleTouchMove(e: TouchEvent) {
      // Only prevent default when actively dragging to preserve scroll
      if (isDraggingRef.current) {
        e.preventDefault()
      }
      const touch = e.touches[0]
      handleMouseMove(touch as unknown as MouseEvent)
    }
    
    function handleTouchEnd(e: TouchEvent) {
      const touch = e.changedTouches[0]
      handleMouseUp(touch as unknown as MouseEvent)
    }
    
    // Add touch listeners for mobile
    disk.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      disk.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      
      // Remove touch listeners
      disk.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isEjected, handleReturnDisk, onDropZoneChange])

  return (
    <>
      {/* Static Floppy Disk Image - completely hidden when ejected */}
      {!isEjected && (
        <div className="text-center mb-8 relative">
          <div 
            ref={staticDiskRef}
            className="mx-auto max-w-sm sm:max-w-md md:max-w-xl relative opacity-90 hover:opacity-100 transition-all duration-500 vibe-image"
            style={{
              transform: 'rotate(-3deg)',
              transition: 'opacity 0.5s ease, transform 0.3s ease'
            }}
          >
          <img 
            src={assetPath("/images/in-orbit-vhs.png")} 
            alt="IN_0RBIT Album on VHS" 
            className="w-full h-auto object-contain"
            style={{
              filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
              userSelect: 'none',
              WebkitUserDrag: 'none'
            } as React.CSSProperties}
            draggable={false}
          />
          
          {/* Label Maker Tape Overlay */}
          <div 
            className="absolute top-[15%] left-[10%] right-[10%] h-8 
                      bg-black/90 
                      border-t border-b border-white/20
                      flex items-center justify-center
                      shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{
              transform: 'rotate(-2deg)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.9) 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Label Text */}
            <div 
              className="relative px-3 text-white"
              style={{
                fontFamily: 'Courier, monospace',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              TRACK PREVIEW
            </div>
            
            {/* Tape Edges - Left */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-2"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              }}
            />
            
            {/* Tape Edges - Right */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-2"
              style={{
                background: 'linear-gradient(270deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              }}
            />
            
            {/* Perforated Edges Effect */}
            <div 
              className="absolute left-0 right-0 top-0 h-[1px]"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)',
              }}
            />
            <div 
              className="absolute left-0 right-0 bottom-0 h-[1px]"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)',
              }}
            />
          </div>
          
          {/* VHS Control Buttons - Old School Style */}
          {!isEjected && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              {/* Rewind Button */}
              <button
                onClick={handleRewind}
                className="w-14 h-11 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 
                          flex items-center justify-center transition-all duration-150 
                          border-2 border-gray-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.5)]
                          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-[1px] rounded-sm"
                title="Rewind"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7L10 1V13L2 7Z" fill="white" opacity="0.9"/>
                  <path d="M10 7L18 1V13L10 7Z" fill="white" opacity="0.9"/>
                </svg>
              </button>
              
              {/* Play/Pause Button */}
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="w-14 h-11 bg-gradient-to-b from-green-700 to-green-900 hover:from-green-600 hover:to-green-800 
                          flex items-center justify-center transition-all duration-150 
                          border-2 border-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.5)]
                          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-[1px] rounded-sm"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="4" height="10" fill="white" opacity="0.9"/>
                    <rect x="8" y="2" width="4" height="10" fill="white" opacity="0.9"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2L12 7L3 12V2Z" fill="white" opacity="0.9"/>
                  </svg>
                )}
              </button>
              
              {/* Eject Button */}
              <button
                onClick={handleEjectDisk}
                className="w-14 h-11 bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 
                          flex items-center justify-center transition-all duration-150 
                          border-2 border-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)]
                          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-[1px] rounded-sm"
                title="Eject"
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2L13 8H3L8 2Z" fill="white" opacity="0.9"/>
                  <rect x="3" y="10" width="10" height="2" fill="white" opacity="0.9"/>
                </svg>
              </button>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Interactive Floppy Disk (only visible when ejected) - Rendered as portal */}
      {isEjected && typeof window !== 'undefined' && createPortal(
        <div 
          ref={diskRef}
          className={`fixed ${isGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            width: isMobile ? '200px' : '300px', // Smaller on mobile
            height: isMobile ? '200px' : '300px',
            zIndex: 100000, // Highest z-index to appear above everything
            transition: 'none',
            userSelect: 'none',
            pointerEvents: 'auto',
            willChange: 'transform',
            left: 0,
            top: 0
          }}
        >
          <img 
            src={assetPath("/images/in-orbit-vhs.png")} 
            alt="IN_0RBIT Album on VHS" 
            className="w-full h-full object-contain"
            style={{
              filter: isGrabbing ? 'brightness(1.1) drop-shadow(0 10px 20px rgba(0,0,0,0.3))' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
              transition: 'filter 0.2s ease',
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserDrag: 'none'
            } as React.CSSProperties}
            draggable={false}
          />
          
          {/* Hand Icon Overlay */}
          {showHandIcon && (
            <div 
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${
                showHandIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{
                animation: showHandIcon ? 'handPulse 2s ease-in-out infinite' : 'none'
              }}
            >
              <div className="bg-white rounded-full p-2 shadow-lg">
                <img 
                  src={assetPath("/images/hand-pointer-regular-full.svg")} 
                  alt="Drag cursor" 
                  className="w-6 h-6 md:w-8 md:h-8"
                  style={{
                    imageRendering: 'pixelated'
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Hidden Audio Elements */}
      <audio 
        ref={audioRef}
        src={assetPath("/audio/in-orbit-preview.mp3")}
        preload="metadata"
        style={{ display: 'none' }}
      />
      <audio 
        ref={rewindSfxRef}
        src={assetPath("/audio/rewind.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={pauseSfxRef}
        src={assetPath("/audio/pause.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={ejectSfxRef}
        src={assetPath("/audio/eject.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={blip1Ref}
        src={assetPath("/audio/blip1.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={blip2Ref}
        src={assetPath("/audio/blip2.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={blip3Ref}
        src={assetPath("/audio/blip3.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={blip4Ref}
        src={assetPath("/audio/blip4.mp3")}
        preload="auto"
        style={{ display: 'none' }}
      />
    </>
  )
})

InteractiveFloppyDisk.displayName = 'InteractiveFloppyDisk'

export default InteractiveFloppyDisk