import { Toolbar } from './components/Toolbar'
import { CanvasView } from './components/CanvasView'
import { StatusPanel } from './components/StatusPanel'
import { EmulatorProvider } from './context/EmulatorContext'
import './App.css'

function App() {
  return (
    <EmulatorProvider>
      <main className="app-shell">
        <Toolbar />
        <CanvasView />
        <StatusPanel />
      </main>
    </EmulatorProvider>
  )
}

export default App
