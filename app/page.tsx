'use client'

import { useState, useEffect, useRef } from 'react'
import JazzModeBackground from '@/components/JazzModeBackground'
import InteractiveFloppyDisk, { InteractiveFloppyDiskRef } from '@/components/InteractiveFloppyDisk'
import { assetPath } from '@/lib/utils'

export default function Home() {
  const [displayedTitle1, setDisplayedTitle1] = useState('')
  const [displayedTitle2, setDisplayedTitle2] = useState('')
  const [isTyping1, setIsTyping1] = useState(false)
  const [isTyping2, setIsTyping2] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPlatforms, setShowPlatforms] = useState(false)
  const platformButtonRef = useRef<HTMLButtonElement>(null)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [showSoundMessage, setShowSoundMessage] = useState(false)
  const [soundMessageVisible, setSoundMessageVisible] = useState(false)
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null)
  const [fusionMode, setFusionMode] = useState(false)
  const [showVibeButton, setShowVibeButton] = useState(false)
  const [diskEjected, setDiskEjected] = useState(false)
  const [currentVibe, setCurrentVibe] = useState<'electro' | 'fusion'>('electro')
  const [showDropZone, setShowDropZone] = useState(false)
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const [dropZoneFirstGrab, setDropZoneFirstGrab] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const vibeAudioRef = useRef<HTMLAudioElement>(null)
  const rawPianoRef = useRef<HTMLAudioElement>(null)
  const processedPianoRef = useRef<HTMLAudioElement>(null)
  const finalMixRef = useRef<HTMLAudioElement>(null)
  const floppyDiskRef = useRef<InteractiveFloppyDiskRef>(null)
  const glitch1Ref = useRef<HTMLAudioElement>(null)
  const glitch2Ref = useRef<HTMLAudioElement>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  
  const title1 = 'IN_0RBIT'
  const title2 = 'J0HN_KNIFIC'
  
  // Carousel media items from /public/images/carousel/
  const carouselMedia = [
    { type: 'image', src: assetPath('/images/carousel/1.jpeg'), alt: 'Studio moment 1' },
    { type: 'image', src: assetPath('/images/carousel/2.jpeg'), alt: 'Studio moment 2' },
    { type: 'image', src: assetPath('/images/carousel/3.jpg'), alt: 'Studio moment 3' },
    { type: 'image', src: assetPath('/images/carousel/4.jpeg'), alt: 'Studio moment 4' },
    { type: 'video', src: assetPath('/images/carousel/5.mp4'), poster: assetPath('/images/carousel/5-thumb.jpg'), alt: 'Studio session 1' },
    { type: 'video', src: assetPath('/images/carousel/6.mp4'), poster: assetPath('/images/carousel/6-thumb.jpg'), alt: 'Studio session 2' },
    { type: 'video', src: assetPath('/images/carousel/7.mp4'), poster: assetPath('/images/carousel/7-thumb.jpg'), alt: 'Studio session 3' },
    { type: 'image', src: assetPath('/images/carousel/8.jpeg'), alt: 'Studio moment 5' },
  ]
  
      const tracks = [
      { 
        number: 1, 
        title: "Introduction", 
        duration: "0:56",
        description: "This is a short setup for The Mathematician. I love Fender Rhodes. In high school, I was obsessed with Chick Corea and Return to Forever. I tried to capture some of that sound.",
        details: "This was a live capture of my Korg SV-1 running through the Hologram Microcosm, which is an incredible granular effect pedal. No plug-ins were used for the reverb or delay. I overlaid a parallel pass of the same track through Arturia EFX Fragments, which I punched in/out to add a little dimension to the track."
      },
      { 
        number: 2, 
        title: "The Mathematician", 
        duration: "4:33",
        description: "This track is the closest I've come to \"my sound\": one part Radiohead, one part Lyle Mays. It's all built around an evolving three-bar piano loop. I had the honor of recording Jamey Haddad on percussion. Joel and I wove together a combination of heavily processed digital sounds with Jamey's unaltered live percussion overdubs.",
        details: "Everything for this track was built around piano. I recorded my Estonia 190 with an Earthworks PM40, adding some saturation and overdrive with a tape emulator. I ran snippets of the piano back through the Hologram Microcosm on glitch mode (the glitched-out synth sound between 00:09 and 00:24 is actually piano). Cass replaced my drum samples with a live kit. Jamey gave us five separate tracks of very unique instruments and polyrhythms to interweave. I used a Prophet-6 for the pads in the bridge. I loved how the open Lydian voicing sounded on that patch, and I built all the other layers around it. My last step was recording a little vocal chant to tie it together."
      },
      { 
        number: 3, 
        title: "In Orbit", 
        duration: "5:21",
        description: "In Orbit was by far the most fun to track. When the voice inside me said, \"Is that too much?\" I responded with, \"Nope, let's add more.\" I pulled from my love of synths and synthwave textures. I wanted a very simple, dance-music-style set of lyrics—like Dua Lipa meets Daft Punk. Like Daft Punk, Genesis, and other great electronic producers, I used a very traditional classical progression that could build and grow over time.",
        details: "Production-wise, there's a lot going on. The Prophet-6 pad with LFO was the first building block. Piano is all over the place, run through many different effects. One in particular was VHS by Baby Audio. It had a really unique chorus that worked well alongside the Prophet—you can hear it on the piano from 0:44 to 0:53. The Prophet-6 sub bass really shone through on this one as well, with some classic sidechain compression. We went back and forth on electronic vs. real kit… when Cass came back with his take, it was a no-brainer. The Earthworks PM40 was key in producing this track. It produces a very clean, consistent stereo image of the piano that allowed us to play with different effects pedals and plug-ins. If you're not sure what instrument you're listening to, it's likely a manipulated piano."
      },
      { 
        number: 4, 
        title: "Bittersweet Days", 
        duration: "4:31",
        description: "I really put myself outside of my comfort zone with this track. When I started this project, I'd rank my skills in (sharply) descending order: piano/keys, harmonic arrangement, production, songwriting. While In Orbit and The Mathematician were built around sonic ideas, Bittersweet Days was written as a song first. I tried to pull some inspiration from Sara Bareilles, Ben Gibbard, and others who are great producers—but songwriters first. The easiest well for me to pull from is being a father of three: the stress, the love, and watching them grow up.",
        details: "The sonic texture from 0:23 to 0:34 is one of my favorites on the EP. I used the Arturia Wurli and added RC-20 Retro Color and Baby Audio's Spaced Out plug-in for delay and reverb. Cass sent back his Steve Gadd–inspired snare pattern, and that locked in the sound. Christine tracked several vocal takes, and we tweaked the lyrics a lot on the fly. I built everything else on top of that but ultimately tried to keep things sparse and let that initial sound of the Wurli and kit carry through."
      }
    ]
  
  useEffect(() => {
    setMounted(true)
    // Start the typewriter effect immediately
    setDisplayedTitle1('') // Start with empty for typewriter
    setDisplayedTitle2('') // Start with empty for typewriter  
    
    // Preload critical images to prevent flicker
    const imagesToPreload = [
      assetPath('/images/carousel/1.jpeg'), // First carousel image
      assetPath('/images/effect-pedals-bw.jpeg'), // Effects pedals image
    ]
    
    imagesToPreload.forEach(src => {
      const img = new Image()
      img.src = src
    })
    
    const startTyping = setTimeout(() => {
      setIsTyping1(true)
    }, 100)
    
    return () => {
      clearTimeout(startTyping)
    }
  }, [])
  
  useEffect(() => {
    if (!isTyping1) return
    
    let timeout: NodeJS.Timeout
    
    if (displayedTitle1.length < title1.length) {
      timeout = setTimeout(() => {
        setDisplayedTitle1(prev => prev + title1[prev.length])
      }, 150)
    } else if (displayedTitle1.length === title1.length) {
      // Start second title after delay
      timeout = setTimeout(() => {
        setIsTyping1(false)
        setIsTyping2(true)
      }, 700)
    }
    
    return () => clearTimeout(timeout)
  }, [displayedTitle1, isTyping1, title1])

  useEffect(() => {
    if (!isTyping2) return
    
    let timeout: NodeJS.Timeout
    
    if (displayedTitle2.length < title2.length) {
      timeout = setTimeout(() => {
        setDisplayedTitle2(prev => prev + title2[prev.length])
      }, 150)
    } else if (displayedTitle2.length === title2.length) {
      setIsTyping2(false)
      // Show sound message after title2 completes
      setTimeout(() => {
        setShowSoundMessage(true)
        setTimeout(() => {
          setSoundMessageVisible(true)
        }, 100)
        
        // Hide sound message and show rest of site
        setTimeout(() => {
          setSoundMessageVisible(false)
          setTimeout(() => {
            setShowSoundMessage(false)
            setTypewriterComplete(true)
            // Small delay to ensure CSS is loaded before showing content
            setTimeout(() => {
              setContentVisible(true)
              // Show vibe button after rest of site appears
              setTimeout(() => {
                setShowVibeButton(true)
              }, 1500)
            }, 50)
          }, 500) // Wait for fade out
        }, 2000) // Show message for 2 seconds
      }, 500) // Small delay after title2 completes
    }
    
    return () => clearTimeout(timeout)
  }, [displayedTitle2, isTyping2, title2])

  // Fusion mode no longer has a timer - it persists until manually changed
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showPlatforms && !target.closest('.platforms-popover')) {
        setShowPlatforms(false)
      }
    }

    if (showPlatforms) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showPlatforms])

  const handleVibeToggle = () => {
    const newVibe = currentVibe === 'electro' ? 'fusion' : 'electro'
    setCurrentVibe(newVibe)
    setFusionMode(newVibe === 'fusion')
    
    // Handle vibe audio
    if (vibeAudioRef.current) {
      if (newVibe === 'fusion') {
        vibeAudioRef.current.play()
      } else {
        vibeAudioRef.current.pause()
        vibeAudioRef.current.currentTime = 0
      }
    }
    
    // If typewriter hasn't completed yet, complete it instantly when switching to fusion
    if (!typewriterComplete && newVibe === 'fusion') {
      setDisplayedTitle1(title1)
      setDisplayedTitle2(title2)
      setIsTyping1(false)
      setIsTyping2(false)
      setTypewriterComplete(true)
      // Small delay before showing content to prevent flash
      setTimeout(() => {
        setContentVisible(true)
      }, 50)
    }
  }

  const handleDropZoneChange = (show: boolean, isOver: boolean) => {
    setShowDropZone(show)
    setIsOverDropZone(isOver)
    
    // Trigger wiggle animation when first showing the drop zone
    if (show && !showDropZone) {
      setDropZoneFirstGrab(true)
      // Reset the animation state after it completes
      setTimeout(() => {
        setDropZoneFirstGrab(false)
      }, 1000) // Match the animation duration
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselMedia.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselMedia.length) % carouselMedia.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const playAudio = (audioRef: React.RefObject<HTMLAudioElement | null>, trackName: string) => {
    // If this track is currently playing, pause it
    if (currentlyPlaying === trackName && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setCurrentlyPlaying(null)
      return
    }
    
    // Stop any currently playing audio
    const audioRefs = [rawPianoRef, processedPianoRef, finalMixRef]
    audioRefs.forEach(ref => {
      if (ref.current && !ref.current.paused) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })
    
    // Play the selected audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setCurrentlyPlaying(trackName)
    }
  }

  // Handle audio ended events
  useEffect(() => {
    const handleEnded = () => setCurrentlyPlaying(null)
    
    const audioRefs = [rawPianoRef, processedPianoRef, finalMixRef]
    audioRefs.forEach(ref => {
      if (ref.current) {
        ref.current.addEventListener('ended', handleEnded)
      }
    })
    
    return () => {
      audioRefs.forEach(ref => {
        if (ref.current) {
          ref.current.removeEventListener('ended', handleEnded)
        }
      })
    }
  }, [])

  // Auto-play video when slide changes to a video
  useEffect(() => {
    if (carouselMedia[currentSlide].type === 'video' && videoRef.current) {
      // Small delay to ensure video is loaded
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          // Silently catch autoplay errors (common on mobile)
        })
      }, 100)
    }
  }, [currentSlide, carouselMedia])

  // Play glitch sounds for title clicks
  const playGlitch1 = () => {
    if (glitch1Ref.current) {
      glitch1Ref.current.currentTime = 0
      glitch1Ref.current.play().catch(() => {
        // Ignore audio play errors
      })
    }
  }

  const playGlitch2 = () => {
    if (glitch2Ref.current) {
      glitch2Ref.current.currentTime = 0
      glitch2Ref.current.play().catch(() => {
        // Ignore audio play errors
      })
    }
  }

  const getVibeClasses = () => {
    switch (currentVibe) {
      case 'electro': return 'electro-mode'
      case 'fusion': return 'fusion-mode'
      default: return 'electro-mode'
    }
  }

  return (
    <>
    <main className={`min-h-screen bg-primary vibe-mode ${getVibeClasses()}`}>
      {fusionMode && <JazzModeBackground />}
      <div className="container mx-auto px-2 sm:px-4 pb-16 relative" style={{ paddingTop: '6rem', zIndex: 1 }}>
        {/* Top Spacer */}
        <div style={{ height: '3rem' }}></div>
        
        {/* Album Title */}
        <section className="max-w-4xl mx-auto mb-2">
          <div className="pl-6 sm:pl-6 md:pl-8">
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] text-shadow-glow vibe-title-1 break-words cursor-pointer hover:brightness-110 transition-all duration-200 ${isTyping1 ? 'typewriter' : 'typewriter-complete'} ${typewriterComplete ? 'crt-title' : ''}`}
              data-text={displayedTitle1}
              onClick={playGlitch1}
              title="Click to play glitch sound"
            >
              {mounted ? displayedTitle1 : ''}
            </h1>
            <h2 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] text-shadow-glow vibe-title-2 break-words cursor-pointer hover:brightness-110 transition-all duration-200 ${isTyping2 ? 'typewriter' : 'typewriter-complete'} ${typewriterComplete ? 'crt-title' : ''}`}
              data-text={displayedTitle2}
              onClick={playGlitch2}
              title="Click to play glitch sound"
            >
              {mounted ? displayedTitle2 : ''}
            </h2>
          </div>
        </section>

        {/* Sound message - appears after titles, disappears before rest of site */}
        {showSoundMessage && (
          <section className="max-w-4xl mx-auto mb-8">
            <div className="pl-6 sm:pl-6 md:pl-8">
              <p 
                className={`text-lg sm:text-xl md:text-2xl font-light text-primary/80 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-500 ${
                  soundMessageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                enjoy with sound on 🔊
              </p>
            </div>
          </section>
        )}

        {/* Rest of site - only show after typewriter is complete */}
        {typewriterComplete && (
          <div className={contentVisible ? 'animate-fade-in' : ''} style={{ opacity: contentVisible ? 1 : 0 }}>
            {/* Hero Section */}
            <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="pl-6 sm:pl-6 md:pl-8">
              <p className="text-xl md:text-2xl leading-relaxed mb-12 text-secondary">
                BLENDING ACOUSTIC AND ELECTRONIC MUSIC
              </p>
            </div>
          </div>
          
          {/* Interactive Floppy Disk */}
          <InteractiveFloppyDisk 
            ref={floppyDiskRef}
            fusionMode={fusionMode}
            onEjectChange={setDiskEjected}
            isEjected={diskEjected}
            onDropZoneChange={handleDropZoneChange}
          />
          

          {/* CTA Section */}
          <div className="text-center relative mt-16" style={{ zIndex: 50 }}>
            {/* Listen Now Header */}
            <h3 className="text-2xl font-bold mb-6 text-primary">Listen Now</h3>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <a 
                href="https://music.apple.com/us/album/in-orbit-ep/1835050642" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-streaming inline-block" 
                data-text="🍎 Apple Music"
              >
                🍎 Apple Music
              </a>
              <a 
                href="https://open.spotify.com/album/5Wnr1xRANUnS0vhC5RSfU7?si=13kNdGE8So2q9N1O7hgxvg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-streaming inline-block" 
                data-text="🎧 Spotify"
              >
                🎧 Spotify
              </a>
              <div className="relative">
                <button 
                  ref={platformButtonRef}
                  className="btn-secondary"
                  onClick={() => setShowPlatforms(!showPlatforms)}
                >
                  More Platforms ▼
                </button>
                
                {/* Platforms Popover */}
                {showPlatforms && (
                  <div className="platforms-popover absolute top-full left-0 mt-2 w-64 glass-effect rounded-xl p-4 z-10 shadow-lg">
                <div className="grid grid-cols-1 gap-2">
                  <a 
                    href="https://music.youtube.com/watch?v=5cBwUxa74OE&si=0mKPPJYMcfCPduJU" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary"
                  >
                    🎵 YouTube Music
                  </a>
                  <a 
                    href="https://music.amazon.com/albums/B0FNBDHQL2?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_XnTlDkKzWibQloLIziiQyB952" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary"
                  >
                    🎧 Amazon Music
                  </a>
                  <button className="text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary">
                    📀 Bandcamp
                  </button>
                  <button className="text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary">
                    🎼 SoundCloud
                  </button>
                  <button className="text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary">
                    🎹 Tidal
                  </button>
                  <button className="text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary">
                    📻 Deezer
                  </button>
                </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About the Album */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="glass-effect vibe-glass rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">About the EP</h2>
            
            {/* Media Carousel */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                {/* Main Carousel Container */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
                  {/* Media Display */}
                  <div className="relative w-full h-full">
                    {carouselMedia[currentSlide].type === 'image' ? (
                      <img 
                        src={carouselMedia[currentSlide].src}
                        alt={carouselMedia[currentSlide].alt}
                        className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-500 opacity-90 hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <video 
                        ref={videoRef}
                        src={carouselMedia[currentSlide].src}
                        poster={carouselMedia[currentSlide].poster}
                        controls
                        playsInline
                        muted
                        preload="metadata"
                        className={`w-full h-full object-cover ${
                          carouselMedia[currentSlide].src.includes('6.mp4') ? 'object-top' : 
                          carouselMedia[currentSlide].src.includes('7.mp4') ? 'object-bottom' : 
                          'object-center'
                        }`}
                        style={{ filter: 'grayscale(0.3)' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all duration-200 hover:scale-110"
                  >
                    ←
                  </button>
                  
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all duration-200 hover:scale-110"
                  >
                    →
                  </button>
                </div>
                
                {/* Thumbnail Strip */}
                <div className="flex justify-center mt-6 space-x-2 overflow-x-auto pb-2 pt-2">
                  {carouselMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentSlide 
                          ? 'border-accent-blue shadow-lg shadow-accent-blue/30 scale-110' 
                          : 'border-white/20 hover:border-white/40 hover:scale-105'
                      }`}
                    >
                      {media.type === 'image' ? (
                        <img 
                          src={media.src}
                          alt={media.alt}
                          className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="relative w-full h-full bg-black/60 flex items-center justify-center">
                          <img 
                            src={media.poster}
                            alt={media.alt}
                            className="w-full h-full object-cover filter grayscale"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Slide Counter */}
                <div className="text-center mt-2 text-sm text-secondary">
                  {currentSlide + 1} / {carouselMedia.length}
                </div>
              </div>
            </div>
            
                          <div className="space-y-4 leading-relaxed text-primary">
                <p>
                I have three albums hanging over my desk: <em>Portraits in Jazz</em> by Bill Evans, <em>OK Computer</em> by Radiohead, and <em>Random Access Memories</em> by Daft Punk. My goal was to produce three tracks blending these inspirations and make something that&rsquo;s very &ldquo;me.&rdquo; It was an awesome journey writing, recording, and producing everything from scratch in Logic. I couldn&rsquo;t have done it without my creative partner, Joel Negus. As a jazz and classically trained pianist, he pushed me outside of my comfort zone in the best ways. The project was also a great excuse to collaborate with my amazing wife, Christine.
                </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Release Details</h3>
                  <ul className="text-sm space-y-1">
                    <li><span className="text-accent-blue">Genre:</span> <span className="text-secondary">Indie Rock, Jazz, Electronic</span></li>
                    <li><span className="text-accent-blue">Length:</span> <span className="text-secondary">4 tracks, 14:11</span></li>
                    <li><span className="text-accent-blue">Released:</span> <span className="text-secondary">2025</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Credits</h3>
                  <ul className="text-sm space-y-1">
                    <li><span className="text-accent-blue">Produced By:</span> <span className="text-secondary"><a href="https://www.linkedin.com/in/johnknific/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2">John Knific</a> & <a href="https://www.clevelandscoring.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2">Joel Negus</a></span></li>
                    <li>
                      <span className="text-accent-blue">Featuring:</span> 
                      <span className="text-secondary">
                        Christine Knific (Vocals),  
                        <a href="https://www.clevelandscoring.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2">Joel Negus</a> (Bass),  
                        <a href="https://www.youtube.com/channel/UCYXpCfUt2BGFegTK0FfEV9g" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2">Cass Jewell</a> (Drums),  
                        <a href="https://jameyhaddad.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2">Jamey Haddad</a> (Percussion)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Track Listings */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="glass-effect vibe-glass rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Track Details</h2>
            <div className="space-y-4">
              {tracks.map((track) => (
                <div key={track.number} className="border border-white/10 rounded-lg overflow-hidden transition-all duration-300">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-white/5"
                    onClick={() => setExpandedTrack(expandedTrack === track.number ? null : track.number)}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-bold w-8 text-accent-blue">{track.number.toString().padStart(2, '0')}</span>
                      <span className="font-medium text-primary">{track.title}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-secondary">{track.duration}</span>
                      <span className={`text-accent-blue transition-transform duration-300 ${expandedTrack === track.number ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                  
                  {expandedTrack === track.number && (
                    <div className="p-4 pt-6 border-t border-white/10 animate-fade-in">
                      <div className="space-y-6">
                        <p className="text-secondary italic">
                          {track.description}
                        </p>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <h4 className="text-sm font-semibold text-accent-blue mb-2">Production Notes</h4>
                          <p className="text-sm text-secondary leading-relaxed">
                            {track.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sound Design */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="glass-effect vibe-glass rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Sound Design</h2>
            
            {/* Description */}
            <div className="mb-8">
              <p className="text-primary leading-relaxed text-center max-w-3xl mx-auto">
              Here is a sample of some of the ways we designed unique sounds by blending acoustic instruments with a combination of effects pedals, plug-ins and more.
              </p>
            </div>
            
            {/* Effects Pedals Image */}
            <div className="mb-8">
              <div className="relative max-w-4xl mx-auto">
                <div className="aspect-[3/1] overflow-hidden rounded-xl bg-black/40">
                  <img 
                    src={assetPath("/images/effect-pedals-bw.jpeg")}
                    alt="Effects pedals setup including Tensor delay and Ottobit jr. bitcrusher"
                    className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-500 opacity-90 hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
            
            {/* Signal Flow Visualization */}
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              {/* Raw Piano */}
              <div className="relative group">
                <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-black/40 rounded-xl p-6 border border-white/20 hover:border-accent-blue/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-accent-blue">01. Raw Piano</h3>
                    <span className="text-xs text-secondary uppercase tracking-wider">Source</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-16 bg-black/60 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Waveform visualization placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-1">
                          {[32, 28, 45, 38, 52, 24, 41, 35, 48, 29, 44, 39, 51, 26, 42, 36, 49, 31, 46, 33].map((height: number, i: number) => (
                            <div 
                              key={i} 
                              className={`w-1 bg-blue-400/50 rounded-full ${currentlyPlaying === 'raw' ? 'animate-pulse' : ''}`}
                              style={{
                                height: `${height}px`,
                                animationDelay: `${i * 0.05}s`,
                                filter: 'blur(0.5px)',
                                opacity: currentlyPlaying === 'raw' ? 1 : 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => playAudio(rawPianoRef, 'raw')}
                    className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-primary ${
                      currentlyPlaying === 'raw' 
                        ? 'bg-accent-blue/30 hover:bg-accent-blue/40' 
                        : 'bg-black/60 hover:bg-accent-blue/20'
                    }`}
                  >
                    <span>{currentlyPlaying === 'raw' ? '⏸' : '▶'}</span>
                    <span className="text-sm">Play Raw</span>
                  </button>
                  
                  <p className="text-xs text-secondary mt-3 italic">
                    Estonia 190 captured with an Earthworks PM40
                  </p>
                </div>
              </div>
              
              {/* Processed */}
              <div className="relative group">
                <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-black/40 rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-purple-400">02. Processed</h3>
                    <span className="text-xs text-secondary uppercase tracking-wider">Effects</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-16 bg-black/60 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Waveform visualization placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-1">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 bg-purple-400/50 rounded-full ${currentlyPlaying === 'processed' ? 'animate-pulse' : ''}`}
                              style={{
                                height: `${Math.random() * 40 + 12}px`,
                                animationDelay: `${i * 0.05}s`,
                                filter: 'blur(0.5px)',
                                opacity: currentlyPlaying === 'processed' ? 1 : 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => playAudio(processedPianoRef, 'processed')}
                    className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-primary ${
                      currentlyPlaying === 'processed' 
                        ? 'bg-purple-500/30 hover:bg-purple-500/40' 
                        : 'bg-black/60 hover:bg-purple-500/20'
                    }`}
                  >
                    <span>{currentlyPlaying === 'processed' ? '⏸' : '▶'}</span>
                    <span className="text-sm">Play Processed</span>
                  </button>
                  
                  <p className="text-xs text-secondary mt-3 italic">
                    Baby Audio VHS chorus and TAIP overdrive parallel processed with Arturia Fragments
                  </p>
                </div>
              </div>
              
              {/* Final Mix */}
              <div className="relative group">
                <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-green-500/10 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-black/40 rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-400">03. Final Mix</h3>
                    <span className="text-xs text-secondary uppercase tracking-wider">Master</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-16 bg-black/60 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Waveform visualization placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-1">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 bg-green-400/50 rounded-full ${currentlyPlaying === 'final' ? 'animate-pulse' : ''}`}
                              style={{
                                height: `${Math.random() * 36 + 16}px`,
                                animationDelay: `${i * 0.05}s`,
                                filter: 'blur(0.3px)',
                                opacity: currentlyPlaying === 'final' ? 1 : 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => playAudio(finalMixRef, 'final')}
                    className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-primary ${
                      currentlyPlaying === 'final' 
                        ? 'bg-green-500/30 hover:bg-green-500/40' 
                        : 'bg-black/60 hover:bg-green-500/20'
                    }`}
                  >
                    <span>{currentlyPlaying === 'final' ? '⏸' : '▶'}</span>
                    <span className="text-sm">Play Final</span>
                  </button>
                  
                  <p className="text-xs text-secondary mt-3 italic">
                    Full mix with bass, drums, and mastering plug-ins
                  </p>
                </div>
              </div>
            </div>
            
            {/* Signal Flow Indicator */}
            <div className="flex items-center justify-center mt-8 space-x-4 text-secondary">
              <span className="text-sm">Signal Flow</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs">1</div>
                <span className="text-xl">→</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">2</div>
                <span className="text-xl">→</span>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs">3</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-24 mb-8">
          <div className="glass-effect vibe-glass rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-secondary space-y-4 md:space-y-0">
              <div className="flex flex-col items-center md:items-start space-y-2">
                <a 
                  href="mailto:john.knific@gmail.com" 
                  className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2"
                >
                  Contact Me
                </a>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs">© 2025 Knerd Creative LLC. All rights reserved.</span>
                  <span className="text-xs">
                    <span className="text-accent-blue">Management:</span>{' '}
                    <a 
                      href="mailto:mmoore@theairloomcompany.com"
                      className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2"
                    >
                      mmoore@theairloomcompany.com
                    </a>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end space-y-1">
                <span className="hover:text-accent-blue transition-colors duration-200">Like the site?</span>
                <a 
                  href="https://k2vp.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-accent-blue transition-colors duration-200 underline underline-offset-2"
                >
                  I also run a product studio
                </a>
              </div>
            </div>
          </div>
        </footer>
            </div>
        )}
      </div>
      
    </main>
    
    {/* Vibe Toggle Button - Fixed to viewport */}
    {showVibeButton && (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleVibeToggle}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 text-lg font-semibold ${
            currentVibe === 'fusion' 
              ? 'bg-gradient-to-br from-purple-500/80 to-orange-500/80 border-yellow-400/80 text-yellow-100 shadow-lg shadow-purple-500/30 scale-105' 
              : 'bg-black/60 hover:bg-black/80 border-white/20 hover:border-white/40 text-white hover:scale-105'
          }`}
          title={currentVibe === 'fusion' ? 'Switch to Electro Mode' : 'Switch to Fusion Mode'}
        >
          VIBE
        </button>
      </div>
    )}
    
    {/* Drop Zone - Rendered at top level to ensure proper fixed positioning */}
    {showDropZone && (
      <button 
        className={`fixed top-5 right-5 w-15 h-15 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm text-2xl cursor-pointer hover:scale-105 ${
          isOverDropZone 
            ? 'bg-blue-500/60 border-2 border-blue-400/80 shadow-lg shadow-blue-500/30 scale-110' 
            : dropZoneFirstGrab
              ? 'bg-blue-500/50 border-2 border-blue-400/60 shadow-lg shadow-blue-500/40 wiggle-animation'
              : 'bg-black/60 hover:bg-black/80 border-2 border-white/20 hover:border-white/40'
        }`}
        style={{ 
          width: '60px', 
          height: '60px',
          filter: dropZoneFirstGrab ? 'brightness(1.3)' : 'brightness(1)',
          zIndex: 100001
        }}
        onClick={() => {
          // Insert the disk using the ref method (includes sound effect)
          floppyDiskRef.current?.insertDisk()
          setShowDropZone(false)
          setIsOverDropZone(false)
          setDropZoneFirstGrab(false)
        }}
        title="Click to insert VHS tape"
      >
        <span className={dropZoneFirstGrab ? 'animate-pulse' : ''}>📼</span>
      </button>
    )}
    
    {/* Vibe Audio - Hidden audio element for fusion mode background music */}
    <audio 
      ref={vibeAudioRef}
      src={assetPath("/audio/vibe-loop.mp3")}
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
    
    {/* Sound Design Audio Elements */}
    <audio 
      ref={rawPianoRef}
      src={assetPath("/audio/piano-raw.mp3")}
      preload="metadata"
      style={{ display: 'none' }}
    />
    <audio 
      ref={processedPianoRef}
      src={assetPath("/audio/piano-processed.mp3")}
      preload="metadata"
      style={{ display: 'none' }}
    />
    <audio 
      ref={finalMixRef}
      src={assetPath("/audio/piano-track.mp3")}
      preload="metadata"
      style={{ display: 'none' }}
    />
    
    {/* Glitch Audio Elements */}
    <audio 
      ref={glitch1Ref}
      src={assetPath("/audio/glitch1.mp3")}
      preload="auto"
      style={{ display: 'none' }}
    />
    <audio 
      ref={glitch2Ref}
      src={assetPath("/audio/glitch2.mp3")}
      preload="auto"
      style={{ display: 'none' }}
    />
    
    {/* Platforms Dropdown Portal - Renders outside main container to avoid clipping */}
    {showPlatforms && platformButtonRef.current && (
      <div 
        className="platforms-popover fixed glass-effect rounded-xl p-4 shadow-2xl"
        style={{
          top: platformButtonRef.current.getBoundingClientRect().bottom + 8,
          left: platformButtonRef.current.getBoundingClientRect().left,
          zIndex: 99999,
          width: '16rem'
        }}
      >
        <div className="grid grid-cols-1 gap-2">
          <a 
            href="https://music.amazon.com/albums/B0FNBDHQL2?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_XnTlDkKzWibQloLIziiQyB952" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary"
            onClick={() => setShowPlatforms(false)}
          >
            <span className="inline-flex items-center">
              <span className="mr-2">🟠</span>
              Amazon Music
            </span>
          </a>
          <a 
            href="https://music.youtube.com/watch?v=5cBwUxa74OE&si=0mKPPJYMcfCPduJU" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary"
            onClick={() => setShowPlatforms(false)}
          >
            <span className="inline-flex items-center">
              <span className="mr-2">▶️</span>
              YouTube Music
            </span>
          </a>
          <a 
            href="https://open.qobuz.com/album/nodco4v3ybdvc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-primary"
            onClick={() => setShowPlatforms(false)}
          >
            <span className="inline-flex items-center">
              <span className="mr-2">💿</span>
              Qobuz
            </span>
          </a>
        </div>
      </div>
    )}
    
    </>
  )
}