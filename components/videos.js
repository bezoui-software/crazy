function Videos() {
  const [videosData, setVideosData] = useState({});
  const [videosLimit, setVideosLimit] = useState(5);
  
  useEffect(() => {
    $('#videos-container').on('scroll', function() {
      if (isScrolledIntoView($('#videos-container .video-container:last'))) setVideosLimit(videosLimit + 5);
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

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
