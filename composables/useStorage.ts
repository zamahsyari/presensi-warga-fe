import { Majlis } from "./useApi"

const useStorage = () => {
  const token = useState('token', () => '')
  const error = useState('error', () => '')
  const officeId = useState('officeId', () => 0)
  const username = useState('username', () => '')
  const name = useState('name', () => '')
  const level = useState('level', () => '')
  const office = useState<Majlis|null>('office', () => null)

  const setToken = (val:string) => {
    token.value = val
  }

  const getToken = () => token.value

  const setOfficeId = (val:number) => {
    officeId.value = val
  }

  const getOfficeId = () => officeId.value

  const setOffice = (val:Majlis) => {
    office.value = val
  }

  const getOffice = () => office.value

  const setUsername = (val:string) => {
    username.value = val
  }

  const getUsername = () => username.value

  const setLevel = (val:string) => {
    level.value = val
  }

  const getLevel = () => level.value

  const setName = (val:string) => {
    name.value = val
  }

  const getName = () => name.value

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
    setError,
    getError
  }
}

export default useStorage;