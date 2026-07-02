import type { CSSProperties } from 'react'
import { typeColors, typePt } from '../constants'
import { capitalize } from '../utils/pokemon'

export function TypeBadge({ type }: { type: string }) {
  const style = { '--type': typeColors[type] } as CSSProperties
  return <span className="type-badge" style={style}><i />{typePt[type] ?? capitalize(type)}</span>
}
