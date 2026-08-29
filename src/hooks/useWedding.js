import { useContext } from 'react'
import { WeddingContext } from '../wedding/wedding-context-store'

export function useWedding() {
  return useContext(WeddingContext)
}
