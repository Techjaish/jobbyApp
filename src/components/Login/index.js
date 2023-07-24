import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {usernameTxt: '', passwordTxt: '', error: false, errorMsg: ''}

  navigate = Token => {
    const {history} = this.props
    Cookies.set('jwt_token', Token, {expires: 4})
    history.replace('/')
  }

  createUser = async event => {
    event.preventDefault()
    const {usernameTxt, passwordTxt} = this.state
    const userInfo = {username: usernameTxt, password: passwordTxt}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userInfo),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (data.status_code === 400) {
      this.setState({error: true, errorMsg: data.error_msg})
    } else {
      this.navigate(data.jwt_token)
    }
  }

  changeUserName = event => {
    this.setState({usernameTxt: event.target.value})
  }

  changeUserPassword = event => {
    this.setState({passwordTxt: event.target.value})
  }

  render() {
    const Token = Cookies.get('jwt_token')
    if (Token !== undefined) {
      return <Redirect to="/" />
    }

    const {usernameTxt, passwordTxt, error, errorMsg} = this.state
    return (
      <div className="main-container">
        <div className="user-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="img"
            alt="website logo"
          />
          <form className="userform-container" onSubmit={this.createUser}>
            <div className="userInfo1">
              <label className="label" htmlFor="userInput">
                USERNAME
              </label>
              <input
                className="inputEl"
                value={usernameTxt}
                type="text"
                id="userInput"
                placeholder="username"
                onChange={this.changeUserName}
              />
            </div>
            <div className="userInfo1">
              <label className="label" htmlFor="passwordInput">
                PASSWORD
              </label>
              <input
                className="inputEl"
                value={passwordTxt}
                type="password"
                id="passwordInput"
                placeholder="password"
                onChange={this.changeUserPassword}
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
            {error && <p className="error">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
