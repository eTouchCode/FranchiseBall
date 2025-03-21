import { create } from 'zustand';
import { Player } from './player.store';

export interface Team {
  _id: string,
  name: string,
  win: number,
  loss: number,
  runs_differential: number,
  avg: number,
  obp: number,
  era: number,
  whip: number,
  team_rank: number,
  runs_on: number,
  world_titles: number,
  league_titles: number,
  division_titles: number,
  weighted_score: number,
  players: Player[],
  lottery_rank?: number
}

const useTeamStore = create((set) => ({
    loading: false,
    setLoading: (state: boolean) => set({ loading: state }),
    teams: [],
    setTeams: (teams: Team[]) => set({ teams: teams }),
    lotteryTeams: null,
    setLotteryTeams: (teams: Team[] | null) => set({ lotteryTeams: teams }),
    isLotteryStarted: false,
    setLotteryStarted: (value: boolean) => set({isLotteryStarted: value}),
  }))

export { useTeamStore }