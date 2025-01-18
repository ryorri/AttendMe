import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
}

function validateToken(): { isValid: boolean; role?: string } {
  const token = sessionStorage.getItem('attend-me:userAuthData')

  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token)

      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        sessionStorage.removeItem('attend-me:userAuthData')
        return { isValid: false }
      } else {
        return {
          isValid: true,
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        }
      }
    } catch (error) {
      console.error('Invalid token:', error)
      sessionStorage.removeItem('attend-me:userAuthData')
      return { isValid: false }
    }
  } else {
    return { isValid: false }
  }
}

export default validateToken
