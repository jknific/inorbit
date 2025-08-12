export interface Album {
  id: string
  title: string
  artist: string
  description: string
  releaseDate: string
  coverArt: string
  genre: string[]
  streamingLinks: StreamingLink[]
  tracks?: Track[]
}

export interface Track {
  id: string
  title: string
  duration: string
  preview?: string
}

export interface StreamingLink {
  platform: 'spotify' | 'apple' | 'youtube' | 'soundcloud' | 'bandcamp'
  url: string
}

export interface Artist {
  id: string
  name: string
  bio: string
  image: string
  socialLinks: SocialLink[]
}

export interface SocialLink {
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'website'
  url: string
}