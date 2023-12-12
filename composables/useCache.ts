import { Majlis } from "./useApi"

const useCache = () => {
  const majlis = useState<Majlis|null>('token', () => null)

  const setMajlis = (val:Majlis) => {
    majlis.value = val
  }

  const getMajlis = () => majlis.value

  return {
    setMajlis,
    getMajlis
  }
}

export default useCache;