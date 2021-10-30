import {BrowserRouter as Router, Route} from 'react-router-dom';

import {CreateRoom} from "./components/CreateRoom/CreateRoom";
import {Room} from "./components/Room/Room";

function App() {
  return (
      <Router>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/:roomId" component={Room} />
      </Router>
  );
}

export default App;
