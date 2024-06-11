import { Majlis } from "./useApi"

const useCache = () => {
  const majlis = useState<Majlis|null>('majlis', () => null)

  const setMajlis = (val:Majlis) => {
    majlis.value = val
    useCookie('majlis').value = JSON.stringify(val)
  }

  const getMajlis = () => {
    if (!majlis.value) {
      const cookie = useCookie('majlis')
      return JSON.parse(cookie.value!)
    } else {
      return majlis.value
    }
  }

  return {
    setMajlis,
    getMajlis
  }
}

export default useCache;