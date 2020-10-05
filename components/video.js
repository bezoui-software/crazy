function VideoSidebar({ videoRef, isVideoPlaying, playVideo, pauseVideo }) {
  const [playVideoToggle, setPlayVideoToggle] = useState();
  const [playVideoToggleIcon, setPlayVideoToggleIcon] = useState();
  const [likeVideoToggle, setLikeVideoToggle] = useState();
  const [likeVideoToggleIcon, setLikeVideoToggleIcon] = useState();
  const [muteToggle, setMuteToggle] = useState();
  const [muteToggleIcon, setMuteToggleIcon] = useState();
 
  const toggleVideoMute = () => {
    setMuteToggle(!muteToggle);
  }

  const toggleLikeVideo = () => {
    setLikeVideoToggle(!likeVideoToggle);
  }

  const toggleVideoPlay = () => {
    setPlayVideoToggle(!playVideoToggle);
  }

  useEffect(() => {
    (muteToggle) ? setMuteToggleIcon('music_off') : setMuteToggleIcon('audiotrack');
    videoRef.current.muted = muteToggle;
  }, [muteToggle])

  useEffect(() => {
    (likeVideoToggle) ? setLikeVideoToggleIcon('favorite') : setLikeVideoToggleIcon('favorite_border');
  }, [likeVideoToggle])

  useEffect(() => {
    (playVideoToggle) ? playVideo() : pauseVideo();
  }, [playVideoToggle])

  useEffect(() => {
    (isVideoPlaying) ? setPlayVideoToggleIcon('pause') : setPlayVideoToggleIcon('play_arrow');
  }, [isVideoPlaying])

  return (
    <div className='video-sidebar-container'>
      <div id='play-video-icon-toggle' className='video-sidebar-toggle-icon material-icons' onClick={ toggleVideoPlay  } > { playVideoToggleIcon } </div>
      <div id='like-video-icon-toggle' className='video-sidebar-toggle-icon material-icons' onClick={ toggleLikeVideo } > { likeVideoToggleIcon } </div>
      <div id='share-video-icon-toggle' className='video-sidebar-toggle-icon material-icons'> share </div>
      <div id='mute-icon-toggle' className='video-sidebar-toggle-icon material-icons' onClick={ toggleVideoMute  } > { muteToggleIcon } </div>
      <Link to='/crazy/record-video'> <div id='record-video-icon-toggle' className='video-sidebar-toggle-icon material-icons'> video_call </div> </Link>
    </div>
  )
}

function VideoInformation({ userName, description, musicName }) {
  return (
      <div className='video-information-container'>
        <div id='username'> @{ userName } </div>  
        <div id='description'> { description } </div>
        <div id='music-name-container'> <div id='music-name'> <p id='music-name-value'> 🎵 { musicName } </p> </div> </div>  
      </div>
  )
}

function VideoFooter({ userName, description, musicName, videoRef }) {
  return (
    <div className='video-footer-container'>
      <VideoInformation userName={ userName } description={ description } musicName={ musicName } /> 
    </div>
  );
}

function Video({ videoData: { videoSrc, userName, description, musicName } }) {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const playVideo = () => {
    if (isVideoPlaying) return;
    videoRef.current.play();
    setIsVideoPlaying(true);
  }

  const pauseVideo = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }

  return (
    <div className='video-container'>
      <video ref={ videoRef } loop onMouseDown={ playVideo } onMouseUp={ pauseVideo } src={ videoSrc } />
      <VideoSidebar videoRef={ videoRef } isVideoPlaying={ isVideoPlaying } playVideo={ playVideo } pauseVideo={ pauseVideo } />
      <VideoFooter userName={ userName } description={ description } musicName={ musicName } videoRef={ videoRef } />
    </div>
  );
}

