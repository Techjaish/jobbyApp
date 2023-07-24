import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-container">
    <Header />
    <div className="content-container">
      <h1 className="heading">Find The Job That Fits Your Life</h1>
      <p className="paragraph">Millions of people are searching for jobs</p>
      <Link to="/jobs">
        <div>
          <button className="find-button" type="button">
            Find Jobs
          </button>
        </div>
      </Link>
    </div>
  </div>
)

export default Home
