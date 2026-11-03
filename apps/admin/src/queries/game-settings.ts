import { useMutation, useQuery } from '@tanstack/react-query'
import { api, apiPost } from '../lib/api'

export const useGameMode = (game: string, interval: number) =>
  useQuery({
    queryKey: ['admin-game-mode', game, interval],
    queryFn: () => api<{ mode: string | null }>(`/game-settings/mode?interval=${interval}&game=${game}`),
  })

export const useSetGameMode = (game: string, interval: number) =>
  useMutation({
    mutationFn: (mode: string) => apiPost('/game-settings/mode', { interval, game, mode }, 'PUT'),
  })
