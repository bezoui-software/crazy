function Videos() {
  const [videosData, setVideosData] = useState({});
  const [VIDEOS_LIMIT, setVideoLimit] = useState(5);

  useEffect(() => {
    database.ref('posts').orderBy('timestamp', 'desc').limit(VIDEOS_LIMIT).on('value', data => setVideosData(data.val()) );
  }, [])

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
