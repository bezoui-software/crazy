const { useEffect, useState, useRef } = React;
const { BrowserRouter: Router, Link, Route, Switch } = ReactRouterDOM;
const { render } = ReactDOM;

function App() {
  return (
    <Router>
      <main>
        <Switch>
          <Route exact path='/'> <Videos /> </Route>
          <Route exact path='/record-video'> <RecordVideo /> </Route>
        </Switch>
      </main>
    </Router>
  );
}

render(<App />, document.body);