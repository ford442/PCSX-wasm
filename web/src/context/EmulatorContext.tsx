import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'

export type EmulatorState = {
  isoFile: File | null
  isoName: string | null
  isRunning: boolean
  statusMessage: string
  lastEventTimestamp: number
}

type EmulatorAction =
  | { type: 'SET_ISO'; payload: File | null }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'PING' }

const initialState: EmulatorState = {
  isoFile: null,
  isoName: null,
  isRunning: false,
  statusMessage: 'Waiting for ISO…',
  lastEventTimestamp: Date.now(),
}

function emulatorReducer(state: EmulatorState, action: EmulatorAction): EmulatorState {
  switch (action.type) {
    case 'SET_ISO': {
      return {
        ...state,
        isoFile: action.payload,
        isoName: action.payload ? action.payload.name : null,
        statusMessage: action.payload ? `Loaded ${action.payload.name}` : 'Waiting for ISO…',
        lastEventTimestamp: Date.now(),
      }
    }
    case 'SET_STATUS': {
      return {
        ...state,
        statusMessage: action.payload,
        lastEventTimestamp: Date.now(),
      }
    }
    case 'SET_RUNNING': {
      return {
        ...state,
        isRunning: action.payload,
        lastEventTimestamp: Date.now(),
      }
    }
    case 'PING':
      return { ...state, lastEventTimestamp: Date.now() }
    default:
      return state
  }
}

export type EmulatorContextValue = EmulatorState & {
  selectIso(file: File | null): void
  setStatus(message: string): void
  setRunning(flag: boolean): void
  ping(): void
}

const EmulatorContext = createContext<EmulatorContextValue | null>(null)

export function EmulatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(emulatorReducer, initialState)

  const value = useMemo<EmulatorContextValue>(
    () => ({
      ...state,
      selectIso: (file) => dispatch({ type: 'SET_ISO', payload: file }),
      setStatus: (message) => dispatch({ type: 'SET_STATUS', payload: message }),
      setRunning: (flag) => dispatch({ type: 'SET_RUNNING', payload: flag }),
      ping: () => dispatch({ type: 'PING' }),
    }),
    [state],
  )

  return <EmulatorContext.Provider value={value}>{children}</EmulatorContext.Provider>
}

export function useEmulator() {
  const ctx = useContext(EmulatorContext)
  if (!ctx) {
    throw new Error('useEmulator must be used within EmulatorProvider')
  }
  return ctx
}
