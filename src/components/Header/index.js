import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const remove = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="img"
          alt="website logo"
        />
      </Link>
      <ul className="nav-menu">
        <Link to="/" className="nav-link">
          <li className="item">Home</li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="item">Jobs</li>
        </Link>
        <li className="button-item">
          <button className="button" type="button" onClick={remove}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
