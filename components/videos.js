function Videos() {
  const [videosData, setVideosData] = useState({});
  const [videosInitialLimit, setVideosInitialLimit] = useState(5);
  const [videosLimit, setVideosLimit] = useState(videosInitialLimit);
  
  const increaseVideosLimit = () => setVideosLimit(videosLimit + videosInitialLimit);
  
  useEffect(() => {
    $('#videos-container').on('scroll', function() {
      if (isScrolledIntoView($(`#videos-container .video-container:nth-child( ${videosLimit - 1} )`))) increaseVideosLimit();
    });
  }, [])
  
  useEffect(() => {
    database.ref('posts').orderByChild('timestamp').limitToLast(videosLimit).on('value', data => setVideosData(data.val()) );
  }, [videosLimit])

  return (
    <div id='videos-container'>
      {
        Object.keys(videosData).reverse().map(key => {
          const videoData = videosData[key];
          return <Video videoData={ videoData } />;
        })
      }
    </div>
  );
}
