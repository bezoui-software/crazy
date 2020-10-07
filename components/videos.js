function Videos() {
  const [videosData, setVideosData] = useState({});
  const [videosLimit, setVideosLimit] = useState(5);

  useEffect(() => {
    database.ref('posts').orderByChild('timestamp').limitToLast(videosLimit).on('value', data => setVideosData(data.val()) );
    
      var windowHeight = $(window).height(),
    gridTop = windowHeight * .1,
    gridBottom = windowHeight + $('ul li:last').height();


  // On each scroll event on window
  $(window).on('scroll', function() {

    // Interested element caching
    var $lastElement = $('#videos-container .video-container:last');
    // Get elemets top
    var thisTop = $lastElement.offset().top - $(window).scrollTop();


    // Check if the element is in the current viewport
    if (thisTop > gridTop && (thisTop + $lastElement.height()) < gridBottom) {
      console.log('Yay! In sight');
    } else {
      console.log('Still not available');
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

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
