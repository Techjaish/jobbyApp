import {Switch, Redirect, Route} from 'react-router-dom'
import LoginalWay from './components/LoginalWay'
import Home from './components/Home'
import Login from './components/Login'
import Jobs from './components/Jobs'
import JobItem from './components/JobItem'
import NotFound from './components/NotFound'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/not-found" component={NotFound} />
    <LoginalWay exact path="/" component={Home} />
    <LoginalWay exact path="/jobs" component={Jobs} />
    <LoginalWay exact path="/jobs/:id" component={JobItem} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
