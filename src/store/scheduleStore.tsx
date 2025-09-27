import { create } from 'zustand'

export type Train = {
    id: number
    trainNumber: string
    departureStation: string
    arrivalStation: string
    departureTime: string
    arrivalTime: string
    platform: number
    status: string
}

type ScheduleState = {
  trains: Train[]
  addTrain: (train: Train) => void
  updateTrain: (id: number, updated: Partial<Train>) => void
  deleteTrain: (id: number) => void
  setTrains: (trains: Train[]) => void
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  trains: [],
  addTrain: (train) =>
    set((state) => ({ trains: [...state.trains, train] })),
  updateTrain: (id, updated) =>
    set((state) => ({
      trains: state.trains.map((t) =>
        t.id === id ? { ...t, ...updated } : t
      ),
    })),
  deleteTrain: (id) =>
    set((state) => ({
      trains: state.trains.filter((t) => t.id !== id),
    })),
  setTrains: (trains) => set({ trains }),
}))
