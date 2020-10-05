

function Videos() {
  const [videosData, setVideosData] = useState({});

  useEffect(() => {
    database.ref('posts').orderByChild('timestamp').on('value', data => setVideosData(data.val()) );
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