const { useEffect, useState, useRef } = React;
const { BrowserRouter: Router, Link, Route, Switch } = ReactRouterDOM;
const { render } = ReactDOM;

function App() {
  return (
    <Router>
      <main>
        <Switch>
          <Route exact path='/crazy'> <Videos /> </Route>
          <Route exact path='/crazy/record-video'> <RecordVideo /> </Route>
        </Switch>
      </main>
    </Router>
  );
}

render(<App />, document.body);
