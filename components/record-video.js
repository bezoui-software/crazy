function RecordVideo() {
  const videoRef = useRef();
  const [ recordedChunks, setRecordedChunks ] = useState();
  const [ mediaRecorder, setMediaRecorder ] = useState();
  const [ selectedVideo, setSelectedVideo ] = useState();
  const [ uploadedVideoSrc, setUploadedVideoSrc ] = useState();
  const [ uploadingState, setUploadingState ] = useState();
  const [ recordingState, setRecordingState ] = useState();
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
 
  const uploadPost = () => {
    if (!uploadedVideoSrc) return;
    const postData = {};
    postData.userName = 'walidbez';
    postData.description = prompt('VIDEO DESCRIPTION:');
    postData.musicName = 'ORIGINAL SONG FROM @walidbez';
    postData.videoSrc = uploadedVideoSrc;
    postData.timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    database.ref('posts').push(postData);
    setUploadingState(false);
    resetAll();
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

  const resetRecordedChunks = () => setRecordedChunks();

  const resetSelectedVideo = () => setSelectedVideo();

  const resetAll = () => {
    resetRecordedChunks();
    resetSelectedVideo();
    setRecordingState('reset');
    setUploadingState(false);
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
    console.log(recordingState);
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

  useEffect(() => { uploadPost(); }, [uploadedVideoSrc])

  useEffect(() => {
    const facingMode = frontCam ? 'exact': 'environment';
    navigator.getUserMedia( {video: { width: 1280, height: 720, facingMode: facingMode}, audio: true}, startStreamingVideo, streamingVideoError);
  }, [frontCam])

  return (
    <div id='record-video-container'>
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
    <div id='record-video-bottom-bar' className='record-video-bar'>
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
    <div id='record-video-top-bar' className='record-video-bar'>
      <Link to='/crazy' id='close-btn' className='material-icons record-video-top-bar-icon'> close </Link>
      <div id='flip-camera-btn' className='material-icons record-video-top-bar-icon' onClick={ flipCamera }> flip_camera_android </div>
    <div id='reset-all-btn' className='material-icons record-video-top-bar-icon' onClick={ flipImageHorizontaly }> compare </div>
      <div id='reset-all-btn' className='material-icons record-video-top-bar-icon' onClick={ resetAll }> delete_outline </div>
    </div>
  )
}

function PostButton({ stopRecording }) {
  return (
    <div id='post-btn' className='material-icons icon-btn disabled-btn' onClick={ stopRecording }> send </div>
  );
}

function AbortVideoUploading({ abortVideoUploading }) {
  return (
    <div id='abort-video-uploading-btn' className='material-icons icon-btn disabled-btn' onClick={ abortVideoUploading }> close </div>
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

const randomID = () => (
  `${Math.floor(Math.random() * 99999999999999)}-${Math.floor(Math.random() * 99999999999999)}-${Math.floor(Math.random() * 99999999999999)}`
)
