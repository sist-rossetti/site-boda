import { useContext } from 'react'
import { WeddingContext } from '../wedding/weddingContext'

export function useWedding() {
  return useContext(WeddingContext)
}
