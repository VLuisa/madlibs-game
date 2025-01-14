import { useState } from 'react'
import './App.css'
import { MadlibsState } from './Types'

function App() {
  const [gameState, setGameState] = useState<MadlibsState | undefined>(undefined)


  return (
    <>
      <h1>Madlibs</h1>
      <div className="card">

      <button onClick={() => 
        {
          setGameState({rawParagraph: "Hello", parsedParagraph: ["Hello", "NOUN"]})
        }
      }>
          count is {gameState?.parsedParagraph}
        </button>
      </div>
    </>
  )
}

export default App
