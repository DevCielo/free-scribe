import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'

function App() {
  const [file, setFile] = useState(null) // We are checking for files initalized to have default value of null
  const [audioStream, setAudioStream] = useState(null)

  const isAudioAvailable = file || audioStream // check if audio is available

  // setFile and setAudioStream as props to home page
  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }
  useEffect(() => {
    console.log(audioStream)
  }, [audioStream])

  return ( 
    // We use className for react
    // do bg-green-400 to see what space anything occupies
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {isAudioAvailable ? ( // check if audio is available if so goes to file display
          <FileDisplay handleAudioReset={handleAudioReset} file={file} audioStream={setAudioStream}/>
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream}/> // pass setFile and setAudioStream as props to home page
        )}
      </section>
      <h1 className='text-green-400'>hello</h1>
      <footer></footer>
    </div>
  )
}

export default App
