export type Play = {
  id: string
  memo: string | null
  spent: number
  result: 'got' | 'failed'
  played_at: string
  created_at: string
}

export type NewPlay = Omit<Play, 'id' | 'created_at'>
