function Videos() {
  const [videosData, setVideosData] = useState({});
  const [videosLimit, setVideosLimit] = useState(5);

  useEffect(() => {
    database.ref('posts').orderByChild('timestamp').limitToLast(videosLimit).on('value', data => setVideosData(data.val()) );
    
    $('#videos-container').scroll(function() {
      if($('#videos-container').scrollTop() + $('#videos-container').height() == $(document).height()) {
        alert("bottom!");
      }
    });
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
