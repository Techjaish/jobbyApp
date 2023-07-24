import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const LoginalWay = props => {
  const Token = Cookies.get('jwt_token')
  if (Token === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default LoginalWay
