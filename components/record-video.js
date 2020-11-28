function RecordVideo() {
  const [ uploadedVideoSrc, setUploadedVideoSrc ] = useState();
  const [ uploadingState, setUploadingState ] = useState();
  const [ recordingState, setRecordingState ] = useState();
  const [ selectedVideo, setSelectedVideo ] = useState();
  const [ recordedChunks, setRecordedChunks ] = useState();

  const resetRecordedChunks = () => setRecordedChunks();

  const resetSelectedVideo = () => setSelectedVideo();

  const resetAll = () => {
    resetRecordedChunks();
    resetSelectedVideo();
    setRecordingState('reset');
    setUploadingState(false);
    setUploadedVideoSrc(null);
  }

  return (
     <div id='record-video'>
     {uploadedVideoSrc ? 
       (<VideoDetailsContainer 
         uploadedVideoSrc={ uploadedVideoSrc } 
         setUploadedVideoSrc={ setUploadedVideoSrc } 
         uploadingState={ uploadingState }
         setUploadingState={ setUploadingState }    
         resetAll={ resetAll }   
       />) : 
      (<RecordVideoContainer 
         uploadedVideoSrc={ uploadedVideoSrc } 
         setUploadedVideoSrc={ setUploadedVideoSrc } 
         uploadingState={ uploadingState }
         setUploadingState={ setUploadingState }
         recordingState={ recordingState }
         setRecordingState={ setRecordingState }
         selectedVideo={ selectedVideo }
         setSelectedVideo={ setSelectedVideo } 
         recordedChunks={ recordedChunks }
         setRecordedChunks={ setRecordedChunks }
         resetAll={ resetAll }
       />)
     }
    </div>
  )
}

function VideoDetailsContainer({ uploadedVideoSrc, setUploadedVideoSrc, uploadingState, setUploadingState, resetAll }) {
  const [description, setDescription] = useState('');
  const inputs = { description: setDescription };

  const uploadPost = () => {
    if (!uploadedVideoSrc) return;
    const postData = {};
    postData.userName = 'walidbez';
    postData.description = description;
    postData.musicName = 'ORIGINAL SONG FROM @walidbez';
    postData.videoSrc = uploadedVideoSrc;
    postData.timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    database.ref('posts').push(postData);
    setUploadingState(false);
    resetAll();
  }
 
  const updateInput = e => { 
    const key = e.target.id.replace('-input', '');
    const setFunc = inputs[key];
    if (setFunc) setFunc(e.target.value);
  }

  const cancelPosting = () => {
    const storageRef = firebase.storage().refFromURL(uploadedVideoSrc); 

    storageRef.delete().then(function() {
      resetAll();
    }).catch(function(error) {
      console.error('REMOVING VIDEO ERROR ', error);
    });
  } 

  return (
     <div id='video-details-container' className='record-video-all-container'>
       <div id='inputs'>
         <Input label='Video Description' placeholder='#crazy my best video #lets_be_crazy' id='description-input' onChange={ updateInput }/>
       </div>
       <div id='buttons'>
         <button id='cancel-posting-btn' className='material-icons' onClick={ cancelPosting }> delete </button>
         <button id='send-full-post-btn' className='material-icons' onClick={ uploadPost }> send </button>
       </div>
     </div>
  )
}

function RecordVideoContainer({ uploadedVideoSrc, setUploadedVideoSrc, uploadingState, setUploadingState, recordingState, setRecordingState, selectedVideo, setSelectedVideo, recordedChunks, setRecordedChunks, resetAll }) {
  const videoRef = useRef();
  const [ mediaRecorder, setMediaRecorder ] = useState();
  const [ uploadingVideoProgress, setUploadingVideoProgress ] = useState();
  const [ uploadingVideoProgressMeterAnimationName, setUploadingVideoProgressMeterAnimationName ] = useState();
  const [ uploadTask, setUploadTask ] = useState();
  const [ mediaRecorderStopped, setMediaRecorderStopped ] = useState();
  const [ frontCam, setFrontCam ] = useState();

  const startStreamingVideo = stream => {
    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = () => videoRef.current.play();
    setMediaRecorder(new MediaRecorder(stream, {mimeType: 'video/webm'}));
  }

  const streamingVideoError = err => { throw new Error(`STREAMING ERROR : ${err}`); }
 
  const flipCamera = () => {
    if (recordingState == 'reset' || recordingState == 'stop' || !recordingState) setFrontCam(!frontCam);
  }
 
  const uploadSelectedVideo = () => {
    if (!selectedVideo || uploadingState) return;
    const id =  randomID();
    const filename = `${id}-${new Date()}`;
    let storageRef = firebase.storage().ref('/user-videos/' + filename); 
    setUploadTask(storageRef.put(selectedVideo));
  }

  const uploadComplete = () => {
    setUploadingVideoProgressMeterAnimationName('uploading-video-progress-meter-fadeout');
    document.getElementById('post-btn').classList.add('enabled-btn');
    document.getElementById('post-btn').classList.remove('disabled-btn');
    document.getElementById('abort-video-uploading-btn').classList.remove('enabled-btn');
    document.getElementById('record-video-btn').classList.remove('disabled-btn');
  }

  const uploadNotComplete = () => {
    setUploadingVideoProgressMeterAnimationName('uploading-video-progress-meter-fadein');
    document.getElementById('post-btn').classList.remove('enabled-btn');
    document.getElementById('post-btn').classList.add('disabled-btn');
    document.getElementById('abort-video-uploading-btn').classList.add('enabled-btn');
    document.getElementById('record-video-btn').classList.add('disabled-btn');
  }

  const uploadAborted = () => {
    uploadComplete();
    resetAll();
  }

  const createSelectedVideo = () => {
    if (!recordedChunks) return;
    const blob = new Blob(recordedChunks, {type: 'video/mp4'});
    setSelectedVideo(blob);
  }
 
  const recodingComplete = () => {
    document.getElementById('flip-camera-btn').classList.remove('hide');
  }
  
  const recodingNotComplete = () => {
    document.getElementById('flip-camera-btn').classList.add('hide');
  }
  
  const startRecording = () => {
    if (mediaRecorder.state == 'inactive') mediaRecorder.start();
  }
  
  const resumeRecording = () => {
    if (mediaRecorder.state == 'paused') mediaRecorder.resume();
  }
  
  const stopRecording = () => {
    if (mediaRecorder.state == 'recording' || mediaRecorder.state == 'paused') mediaRecorder.stop();
  }
  
  const pauseRecording = () => {
    if (mediaRecorder.state == 'recording')  mediaRecorder.pause();
  }
  
  useEffect(() => {
    if (!mediaRecorder) return;
    switch(recordingState) {

      case 'start':
        startRecording();
        break;

      case 'resume':
        resumeRecording();
        break;

      case 'stop':
        stopRecording();
        break;

      case 'pause':
        pauseRecording();
        break;

      case 'reset':
        stopRecording();
        break;

    }
  }, [recordingState])
  
  useEffect(() => {
    (recordingState == 'start' || recordingState == 'resume' || recordingState == 'pause') ? recodingNotComplete() : recodingComplete();
  }, [recordingState])
  
  useEffect(() => {
    if (!mediaRecorder) return;
    let recordedChunks = [];
    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
    mediaRecorder.onstop = () => setRecordedChunks(recordedChunks);
  }, [mediaRecorder])

  useEffect(() => {
    if (recordedChunks && recordingState == 'stop') createSelectedVideo();
  }, [recordedChunks])

  useEffect(() => {
    if (!uploadTask) return;
    uploadTask.on('state_changed', snapshot => {
      // UPLOADING STILL IN PROGRESS
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadingVideoProgress(progress);
    }, error => {
      //UPLOADING ERROR
      if (error.code == 'storage/canceled') uploadAborted();
    }, () => {
      //UPLOADING COMPLETE
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => { setUploadedVideoSrc(downloadURL) });
    });
    setUploadingState(true);
  }, [uploadTask])

  useEffect(() => { uploadSelectedVideo(); }, [selectedVideo])

  useEffect(() => { (uploadingVideoProgress < 100) ? uploadNotComplete() : uploadComplete(); }, [uploadingVideoProgress])

  useEffect(() => {
    const facingMode = frontCam ? 'exact': 'environment';
    navigator.getUserMedia( {video: { width: 1280, height: 720, facingMode: facingMode}, audio: true}, startStreamingVideo, streamingVideoError);
  }, [frontCam])

  return (
    <div id='record-video-container' className='record-video-all-container'>
      <RecordVideoTopBar resetAll={ resetAll } flipCamera={ flipCamera }/>
      <RecordVideoBottomBar recordingState={ recordingState } setRecordingState={ setRecordingState } uploadTask={ uploadTask } uploadingVideoProgress={ uploadingVideoProgress } uploadingState={ uploadingState } />
      <video muted id='video-stream' ref={ videoRef } />
      <VideoUploadingProgressMeter progress={ uploadingVideoProgress } animationName={ uploadingVideoProgressMeterAnimationName } />
    </div>
  );
}

function RecordVideoBottomBar({ recordingState, setRecordingState, uploadTask, uploadingVideoProgress, uploadingState }) {
  const abortVideoUploading = () => { if (uploadingVideoProgress > 0 && uploadingVideoProgress < 100) uploadTask.cancel(); }
  
  const startRecording = () => {
    if (uploadingState) return;
    document.getElementById('record-video-btn').classList.add('recording-btn');
    (recordingState != 'pause') ? setRecordingState('start') : setRecordingState('resume');
  }

  const stopRecording = () => {
    if (uploadingState) return;
    document.getElementById('record-video-btn').classList.remove('recording-btn');
    setRecordingState('stop');
  }

  const pauseRecording = () => {
    document.getElementById('record-video-btn').classList.remove('recording-btn');
    setRecordingState('pause');
  }

  return (
    <div id='bottom-bar' className='record-video-bar'>
      <AbortVideoUploading abortVideoUploading={ abortVideoUploading } />
      <RecordButton startRecording={ startRecording } pauseRecording={ pauseRecording } />
      <PostButton stopRecording={ stopRecording } />
    </div>
  )
}

function RecordVideoTopBar({ resetAll, flipCamera }) {
  const flipImageHorizontaly = () => {
    document.getElementById('video-stream').classList.toggle('flip-horizontaly');
  }
  
  return (
    <div id='top-bar' className='record-video-bar'>
      <Link to='/crazy' id='close-btn' className='material-icons top-bar-icon'> close </Link>
      <div id='flip-camera-btn' className='material-icons top-bar-icon' onClick={ flipCamera }> flip_camera_android </div>
      <div id='reset-all-btn' className='material-icons top-bar-icon' onClick={ flipImageHorizontaly }> compare </div>
      <div id='reset-all-btn' className='material-icons top-bar-icon' onClick={ resetAll }> delete_outline </div>
    </div>
  )
}

function PostButton({ stopRecording }) {
  return (
    <div id='post-btn' className='material-icons bottom-bar-icon disabled-btn' onClick={ stopRecording }> send </div>
  );
}

function AbortVideoUploading({ abortVideoUploading }) {
  return (
    <div id='abort-video-uploading-btn' className='material-icons bottom-bar-icon disabled-btn' onClick={ abortVideoUploading }> close </div>
  );
}

function RecordButton({ startRecording, pauseRecording }) {
  return (
    <div id='record-video-btn-container' onMouseDown={ startRecording } onMouseUp={ pauseRecording } onTouchStart={ startRecording } onTouchEnd={ pauseRecording }>
      <div id='record-video-btn'></div>
    </div>
  )
}

function VideoUploadingProgressMeter({ progress, animationName }) {
  return (
    <meter style={{ animation: animationName + ' 1s ease forwards' }} id='uploading-video-progress' max='100' value={ progress }></meter>
  )
}

function Input({ label, placeholder, onChange, id }) {
  return (
    <div className='input-container'>
      <label> { label } </label>
      <input id={ id } placeholder={ placeholder }  onChange={ onChange } />
    </div>
  )
}

const randomID = () => (
  `${Math.floor(Math.random() * 99999999999999)}-${Math.floor(Math.random() * 99999999999999)}-${Math.floor(Math.random() * 99999999999999)}`
)
