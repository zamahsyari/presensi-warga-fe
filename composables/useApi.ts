import axios from "axios"

export type GetMajlisResponse = {
  data: Majlis[],
}

export type PostLoginResponse = {
  id: number
  username: string
  name: string
  token: string
  office_id: number
}

export type Majlis = {
  office_id: number
  office_code: string
  office_name: string
  office_address: string
  office_phone: string
  office_delegation: number
}

export type Acara = {
  id: number
  office_id: number
  name: string
  start_at: string
  end_at: string
  is_active: number
  description: string
  created_at: string
  updated_at: string
  office_name?: string
  session_id: number|null
  interval: string
}

export type GetEventResponse = {
  data: Acara[],
}

export type Presence = {
  id: number
  member_id: number
  event_id: number
  note: string
  permit_type: number
  created_at: string
  updated_at: string
  office_name: string
  name: string
  member_name: string
  member_gender: number
}

export type PresenceRequest = {
  member_id: number
  event_id: number
  note: string
  permit_type: number
}

export type GetPresenceResponse = {
  data: Presence[],
}

export type Warga = {
  member_id: number
  office_id: number
  delegation_id: number
  member_name: string
  member_gender: number
  member_address: string
  member_phone: string
  member_mustamik: number
}

export type GetWargaResponse = {
  data: Warga[],
}

export type Gelombang = {
  id: number
  label: string
  posisi: number
  offices_id: number
  office_name: string
}

export type GetGelombangResponse = {
  data: Gelombang[],
}

export type ChangePasswordRequest = {
  user_id: number
  user_name: string
  user_password: string
}

const useApi = (baseURL:string, token:string) => {
  const postLogin = async (username:string, password:string):Promise<PostLoginResponse> => {
    const url = `${baseURL}/auth/login`
    const {data, status} = await axios.post<PostLoginResponse>(url, {
      username,
      password
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data)
  }

  const getMajlisById = async (id:number):Promise<Majlis> => {
    const url = `${baseURL}/majlis/${id}/detail`
    const {data, status} = await axios.get<GetMajlisResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    if (data.data.length > 0) {
      return Promise.resolve(data.data[0])  
    }
    return Promise.resolve({
      office_id: 0,
      office_name: '',
      office_code: '',
      office_address: '',
      office_phone: '',
      office_delegation: 0
    })
  }

  const getPerwakilan = async ():Promise<Majlis[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/majlis/perwakilan?per_page=${maxInt}`
    const {data, status} = await axios.get<GetMajlisResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const getCabangByPerwakilan = async (code:string):Promise<Majlis[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/majlis/cabang?per_page=${maxInt}&perwakilan=${code}`
    const {data, status} = await axios.get<GetMajlisResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const getGelombang = async (officeId:number):Promise<Gelombang[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/session?per_page=${maxInt}&filter=offices_id:${officeId}`
    const {data, status} = await axios.get<GetGelombangResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const formatDecimal = (val:number):string => {
    if (val < 10) return `0${val}`
    return `${val}`
  }

  const getEvents = async (q:string, officeId:number):Promise<Acara[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    let url = ''
    if (officeId != 0) {
      url = `${baseURL}/events?per_page=${maxInt}&page=1&filter=name:${q}`
    } else {
      url = `${baseURL}/events?per_page=${maxInt}&page=1&filter=name:${q},office_id:${officeId}`
    }
    const now = new Date()
    const dateNow = `${formatDecimal(now.getFullYear())}-${formatDecimal(now.getMonth() + 1)}-${formatDecimal(now.getDate())}`
    const nextWeek = new Date()
    nextWeek.setDate(now.getDate() + 7)
    const dateNextWeek = `${formatDecimal(nextWeek.getFullYear())}-${formatDecimal(nextWeek.getMonth() + 1)}-${formatDecimal(nextWeek.getDate())}`
    url = `${url},from:${dateNow},to:${dateNextWeek},name:${q}&sort=updated_at:-1`
    const {data, status} = await axios.get<GetEventResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    console.log('datanya', data)
    return Promise.resolve(data.data)
  }

  const getEventById = async (id:number):Promise<Acara> => {
    let url = `${baseURL}/events/${id}`
    const {data, status} = await axios.get<GetEventResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data[0])
  }

  const postEvent = async (payload:Acara):Promise<string> => {
    let url = `${baseURL}/events`
    const {data, status} = await axios.post<GetEventResponse>(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data[0])
  }

  const getPresences = async (eventId:number):Promise<Presence[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/presences?filter=event_id:${eventId}&per_page=${maxInt}&page=1`
    const {data, status} = await axios.get<GetPresenceResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const postPresence = async (payload:PresenceRequest):Promise<void> => {
    const url = `${baseURL}/presences`
    const {data, status} = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve()
  }

  const deletePresence = async (id:number):Promise<void> => {
    const url = `${baseURL}/presences/${id}`
    const {data, status} = await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve()
  }

  const getWarga = async ():Promise<Warga[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/warga?per_page=${maxInt}&page=1`
    const {data, status} = await axios.get<GetWargaResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const postWarga = async (payload:Warga):Promise<void> => {
    const url = `${baseURL}/warga`
    const {data, status} = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve()
  }

  const getWargaCabang = async (idCabang:number, q?:string):Promise<Warga[]> => {
    const maxInt = Number.MAX_SAFE_INTEGER
    const url = `${baseURL}/warga?filter=office_id:${idCabang},member_name:${q ? q : ''}&per_page=${maxInt}&page=1`
    const {data, status} = await axios.get<GetWargaResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve(data.data)
  }

  const putNewAdminPassword = async (id:number, payload:ChangePasswordRequest):Promise<void> => {
    const url = `${baseURL}/users/password/${id}`
    const {data, status} = await axios.put(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve()
  }

  const putNewOfficePassword = async (id:number, payload:ChangePasswordRequest):Promise<void> => {
    const url = `${baseURL}/users/office-password/${id}`
    const {data, status} = await axios.put(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (status !== 200) {
      return Promise.reject('ERROR')
    }
    return Promise.resolve()
  }

  return {
    postLogin,
    getPerwakilan,
    getCabangByPerwakilan,
    getGelombang,
    getEvents,
    getEventById,
    getPresences,
    postPresence,
    deletePresence,
    getWarga,
    getWargaCabang,
    postWarga,
    postEvent,
    getMajlisById,
    putNewAdminPassword,
    putNewOfficePassword,
  }
}

export default useApi