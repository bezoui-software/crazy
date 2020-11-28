const { useReducer } = React;

function videosLimitReducer(state, action) {
  switch (action.type) {
    case 'increase':
      return { limit: state.limit + state.increaseAmount, increaseAmount: state.increaseAmount, decreaseAmount: state.decreaseAmount };
      break;
    case 'decrease':
      return { limit: state.limit - state.decreaseAmount, increaseAmount: state.increaseAmount, decreaseAmount: state.decreaseAmount };
      break;
    case 'reset':
      return {limit: 5, increaseAmount: state.increaseAmount, decreaseAmount: state.decreaseAmount }; 
      break;
  }
}

function Videos() {
  const [videosData, setVideosData] = useState({});
  const [videosInitialLimit, setVideosInitialLimit] = useState(2);
  const [videosLimit, setVideosLimitAction] = useReducer(videosLimitReducer, { limit: 5, increaseAmount: 5, decreaseAmount: 5});
  
  const increaseVideosLimit = () => setVideosLimitAction({ type: 'increase' });
  const decreaseVideosLimit = () => setVideosLimitAction({ type: 'decrease' });
  const resetVideosLimit = () => setVideosLimitAction({ type: 'reset' });
  const fetchPosts = () => {
    database.ref('posts').orderByChild('timestamp').limitToLast(videosLimit.limit).on('value', data => setVideosData(data.val()) );
  }

  useEffect(() => {
    $('#videos-container').off('scroll');
    $('#videos-container').on('scroll', () => {
      if (isScrolledIntoView($(`#videos-container .video-container:nth-child( ${videosLimit.limit} )`))) increaseVideosLimit();
      if (isScrolledIntoView($(`#videos-container .video-container:nth-child( ${ videosLimit.limit - videosLimit.decreaseAmount - 1 } )`))) decreaseVideosLimit();
      if (isScrolledIntoView($(`#videos-container .video-container:first`))) resetVideosLimit();
    });
  }, [videosLimit])
  
  useEffect(() => {
    fetchPosts();
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
