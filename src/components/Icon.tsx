import type { ReactNode } from 'react'

export type IconName =
  | 'checkSquare'
  | 'target'
  | 'network'
  | 'sun'
  | 'bookOpen'
  | 'compass'
  | 'leaf'
  | 'sprout'
  | 'layoutGrid'
  | 'cards'
  | 'divide'
  | 'cloudRain'
  | 'waves'
  | 'wind'
  | 'bell'
  | 'waveform'
  | 'moon'
  | 'mountain'
  | 'droplet'
  | 'activity'
  | 'pencil'
  | 'ban'
  | 'sparkles'
  | 'musicNote'
  | 'bowl'
  | 'keys'
  | 'brush'
  | 'code'
  | 'message'
  | 'chefHat'
  | 'ruler'
  | 'crown'
  | 'mic'
  | 'camera'
  | 'star'
  | 'starOutline'
  | 'check'
  | 'flame'
  | 'refresh'

const paths: Record<IconName, ReactNode> = {
  checkSquare: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <polyline points="8 12.5 11 15.5 16 9" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="7" r="2.2" />
      <circle cx="12" cy="17" r="2.2" />
      <line x1="7.7" y1="8.3" x2="10.5" y2="15" />
      <line x1="16.3" y1="8.3" x2="13.5" y2="15" />
      <line x1="8.2" y1="7" x2="15.8" y2="7" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
      <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
      <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M3 5.5C3 4.67 3.67 4 4.5 4H10a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H3z" />
      <path d="M21 5.5c0-.83-.67-1.5-1.5-1.5H14a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H21z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="14.3,9.7 12,15 9.7,14.3 12,9" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c8 0 14-6 14-14V4h-2C8 4 4 10 4 18v2z" />
      <path d="M4.5 19.5C7 16.8 10 14 14.5 10.8" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 22v-8" />
      <path d="M12 14c-4 0-7-3-7-7 4 0 7 2 7 5" />
      <path d="M12 14c4 0 7-3 7-7-4 0-7 2-7 5" />
    </>
  ),
  layoutGrid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  cards: (
    <>
      <rect x="4.3" y="7.3" width="11" height="14" rx="2" transform="rotate(-10 9.8 14.3)" />
      <rect x="8" y="3" width="11" height="14" rx="2" />
    </>
  ),
  divide: (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="6.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.8" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  cloudRain: (
    <>
      <path d="M6.5 17a4.3 4.3 0 0 1 .4-8.6 6 6 0 0 1 11.4 2.1A4 4 0 0 1 17.6 17z" />
      <line x1="9" y1="19.5" x2="8" y2="22.5" />
      <line x1="13" y1="19.5" x2="12" y2="22.5" />
      <line x1="17" y1="19.5" x2="16" y2="22.5" />
    </>
  ),
  waves: (
    <>
      <path d="M2 8c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M2 13c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M2 18c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
    </>
  ),
  wind: (
    <>
      <path d="M3 8h9.5a2.5 2.5 0 1 0-2.4-3.2" />
      <path d="M3 12.5h13.5a2.5 2.5 0 1 1-2.4 3.2" />
      <path d="M3 17h7" />
    </>
  ),
  bell: (
    <>
      <path d="M12 3a5 5 0 0 0-5 5c0 5-2 6-2 8h14c0-2-2-3-2-8a5 5 0 0 0-5-5z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  waveform: (
    <>
      <line x1="4" y1="10" x2="4" y2="18" />
      <line x1="8.5" y1="6" x2="8.5" y2="18" />
      <line x1="13" y1="3" x2="13" y2="18" />
      <line x1="17.5" y1="7.5" x2="17.5" y2="18" />
      <line x1="21" y1="11.5" x2="21" y2="18" />
    </>
  ),
  moon: <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />,
  mountain: (
    <>
      <path d="M3 19h18L14.5 7 10.5 14l-2-2.5L3 19z" />
      <circle cx="17.5" cy="5.5" r="1.6" />
    </>
  ),
  droplet: <path d="M12 3s6.2 7.1 6.2 11.2A6.2 6.2 0 0 1 5.8 14.2C5.8 10.1 12 3 12 3z" />,
  activity: <polyline points="3 12 8 12 10 6 14 18 16 12 21 12" />,
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.4 4.3L18 9l-4.6 1.7L12 15l-1.4-4.3L6 9l4.6-1.7L12 3z" />
      <path d="M19 15.5l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z" />
    </>
  ),
  musicNote: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  bowl: (
    <>
      <path d="M3 12h18a9 6.2 0 0 1-18 0z" />
      <path d="M6.5 12c-.3-3.3 1.8-6.5 5.5-7" />
    </>
  ),
  keys: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="1.5" />
      <line x1="7.5" y1="4" x2="7.5" y2="14" />
      <line x1="12" y1="4" x2="12" y2="14" />
      <line x1="16.5" y1="4" x2="16.5" y2="14" />
    </>
  ),
  brush: (
    <>
      <path d="M18.4 2.6a2.1 2.1 0 0 1 3 3l-8.9 8.9-3-3z" />
      <path d="M9 12l-4.2 4.2a2.6 2.6 0 0 0 3.7 3.7L13 15.5" />
    </>
  ),
  code: (
    <>
      <polyline points="8.5 6 3 12 8.5 18" />
      <polyline points="15.5 6 21 12 15.5 18" />
    </>
  ),
  message: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.8A8 8 0 1 1 21 12z" />,
  chefHat: (
    <>
      <path d="M7 10.5a4 4 0 0 1 3.6-6.1 3 3 0 0 1 2.8 0 4 4 0 0 1 3.6 6.1V17H7z" />
      <line x1="6" y1="20" x2="18" y2="20" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <line x1="7" y1="8" x2="7" y2="11" />
      <line x1="11" y1="8" x2="11" y2="11" />
      <line x1="15" y1="8" x2="15" y2="11" />
      <line x1="19" y1="8" x2="19" y2="11" />
    </>
  ),
  crown: (
    <>
      <path d="M4 18h16" />
      <path d="M6 18l-1.5-9L9 12l3-6 3 6 4.5-3L18 18z" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="12" rx="3" />
      <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="8.5" y1="21" x2="15.5" y2="21" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7l1.3-2h3.4L15 7" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  star: <polygon points="12 3.5 14.6 9.2 20.8 9.9 16.2 14.1 17.5 20.3 12 17.1 6.5 20.3 7.8 14.1 3.2 9.9 9.4 9.2" fill="currentColor" stroke="none" />,
  starOutline: <polygon points="12 3.5 14.6 9.2 20.8 9.9 16.2 14.1 17.5 20.3 12 17.1 6.5 20.3 7.8 14.1 3.2 9.9 9.4 9.2" />,
  check: <polyline points="4 12.5 9.5 18 20 6" />,
  flame: <path d="M12 2.5c1 3-3 4.5-3 8a3 3 0 0 0 6 0c0-1-.5-1.7-1-2.3 1.8.6 3 2.6 3 5a5 5 0 0 1-10 0c0-4.5 3.5-6 5-10.7z" />,
  refresh: (
    <>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9M20.5 12a8.5 8.5 0 0 1-14.6 5.9" />
      <polyline points="18.5 3.5 18.5 7.5 14.5 7.5" />
      <polyline points="5.5 20.5 5.5 16.5 9.5 16.5" />
    </>
  ),
}

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
}: {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
