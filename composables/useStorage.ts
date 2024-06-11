import { Majlis } from "./useApi"

const useStorage = () => {
  const token = useState('token', () => '')
  const error = useState('error', () => '')
  const officeId = useState('officeId', () => 0)
  const userId = useState('userId', () => 0)
  const username = useState('username', () => '')
  const name = useState('name', () => '')
  const level = useState('level', () => '')
  const office = useState<Majlis|null>('office', () => null)

  const setToken = (val:string) => {
    token.value = val
    useCookie('token').value = val
  }

  const getToken = () => {
    if (token.value === '') {
      const cookie = useCookie('token')
      return cookie.value!
    } else {
      return token.value
    }
  }

  const setOfficeId = (val:number) => {
    officeId.value = val
    useCookie('officeId').value = val === null ? '' : `${val}`
  }

  const getOfficeId = () => {
    if (officeId.value === 0) {
      const cookie = useCookie('officeId')
      return parseInt(cookie.value!)
    } else {
      return officeId.value
    }
  }

  const setOffice = (val:Majlis) => {
    office.value = val
    useCookie('office').value = JSON.stringify(val)
  }

  const getOffice = () => {
    if (!office.value) {
      const cookie = useCookie('office')
      return JSON.parse(cookie.value!)
    } else {
      return office.value
    }
  }

  const setUsername = (val:string) => {
    username.value = val
    useCookie('username').value = val
  }

  const getUsername = () => {
    if (username.value === '') {
      const cookie = useCookie('username')
      return cookie.value!
    } else {
      return username.value
    }
  }

  const setLevel = (val:string) => {
    level.value = val
    useCookie('level').value = val
  }

  const getLevel = () => {
    if (level.value === '') {
      const cookie = useCookie('level')
      return cookie.value
    } else {
      return level.value
    }
  }

  const setName = (val:string) => {
    name.value = val
    useCookie('name').value = val
  }

  const getName = () => {
    if (name.value === '') {
      const cookie = useCookie('name')
      return cookie.value
    } else {
      return name.value
    }
  }

  const setUserId = (val:number) => {
    userId.value = val
    useCookie('userId').value = `${val}`
  }

  const getUserId = () => {
    if (userId.value === 0) {
      const cookie = useCookie('userId')
      return parseInt(cookie.value!)
    } else {
      return userId.value
    }
  }

  const setError = (val:string) => {
    error.value = val
  }

  const getError = () => error.value

  return {
    setToken,
    getToken,
    setOfficeId,
    getOfficeId,
    setOffice,
    getOffice,
    setUsername,
    getUsername,
    setLevel,
    getLevel,
    setName,
    getName,
    setUserId,
    getUserId,
    setError,
    getError
  }
}

export default useStorage;