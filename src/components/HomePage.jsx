import React, {useState, useEffect, useRef} from 'react'

const HomePage = (props) => {
  const { setFile, setAudioStream } = props
  
  // when updating useState variables they are re-rendered
  // use useState when it effects the UI or side effects
  const [recordingStatus, setRecordingStatus] = useState('inactive')
  const [audioChunks, setAudioChunks] = useState([])
  const [duration, setDuration] = useState(0)

  // useRef creates a mutable object which persists for the lifetime of the component
  const mediaRecorder = useRef(null)
  
  // Specifying a mimeType ensures that the recorded audio is in a format that can be easily handled and played back by web browsers.
  const mimeType = 'audio/webm'

  async function startRecording() {
    let tempStream

    console.log('Start recording')

    try {
        const streamData = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        // if user grants permission we obtain media stream used for media recorder
        tempStream = streamData
    } catch (err) {
        console.log(err.message)
        return
    }
    setRecordingStatus('recording')

    // create new Media recorder instance using the stream
    const media = new MediaRecorder(tempStream, {type: mimeType})
    mediaRecorder.current = media

    // start recording
    mediaRecorder.current.start()

    // media recorder doesnt capture all audio in one chunk, instead it breaks it into chunks. These chunks are stored.
    let localAudioChunks = []
    mediaRecorder.current.ondataavilable = (event) => {
        if (typeof event.data === 'undefined') {
            return
        }
        if (event.data.size === 0) {
            return
        }
        localAudioChunks.push(event.data)
        setAudioChunks(localAudioChunks)
    }
  }

  async function stopRecording() {
    setRecordingStatus('inactive')
    console.log('Stop recording')
    
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
        // a Blob (binary large object) is created from the audio chunks and represents entire recording in one object
        const audioBlob = new Blob(audioChunks, {type: mimeType})
        setAudioStream(audioBlob)
        setAudioChunks([])
        setDuration(0)
    }
  }

  // when recording status changes the useEffect is triggered
  useEffect(() => {
    if (recordingStatus === 'inactive') {
        return
    }

    // every 1000 milliseconds add 1 second to the duration
    const interval = setInterval(() => {
        setDuration(curr => curr + 1)
    }, 1000);

    // when recording status changes or component unmounts the cleanup function is called.
    return () => clearInterval(interval)
  })


  return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Free<span className="text-blue-400 bold">Scribe</span></h1>
        <h3 className='font-medium md:text-lg'>Record <span className="text-blue-400">&rarr; </span> 
        Transcribe <span className='text-blue-400'>&rarr;</span> Translate</h3> 
        <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} className='flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4'>
            <p className='text-blue-400'>{recordingStatus === 'inactive' ? 'Record' : 'Stop recording'}</p>
            <div className='flex items-center gap-2'>
                {duration && (
                    <p className='text-sm'>{duration}s</p>
                )}
            </div>
            <i className={"fa-solid duration-200 fa-microphone " +
             (recordingStatus === 'recording' ? 'text-rose-300' : '')}></i>
        </button>
        <p className='text-base'>Or <label className='text-blue-400 cursor-pointer hover:text-blue-600 duration-200'>upload 
        <input onChange={(e) => { // gets files, e.target.files is an array since we only want to accept one we grab the 0th and we set it as a file
            const tempFile = e.target.files[0]
            setFile(tempFile)
        }} className='hidden' type='file' accept='.mp3, .wave'/></label> a mp3 file</p>
        <p className='italic text-slate-400'>Free now free forever</p>
    </main>
  )
}

export default HomePage