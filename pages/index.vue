<script setup lang="ts">
const router = useRouter()
const config = useRuntimeConfig()
let api = useApi(config.public.API_BASE_URL, '')
const storage = useStorage()

const username = useState('username', () => '')
const password = useState('password', () => '')
const errorMessage = useState('error', () => '')

const gotoNext = async () => {
  if (await doLogin()){
    await getOffice()
    router.push({
      path: "/event"
    })
  }
}

const doLogin = async ():Promise<boolean> => {
  try{
    const response = await api.postLogin(username.value, password.value)
    storage.setToken(response.token)
    storage.setOfficeId(response.office_id)
    storage.setName(response.name)
    storage.setUsername(response.username)
    api = useApi(config.public.API_BASE_URL, storage.getToken())
    return true
  }catch(e:any){
    if (e.request.status === 400) {
      errorMessage.value = 'Email atau password salah'
    } else {
      errorMessage.value = 'Ups, terjadi kesalahan'
    }
    return false
  }
}

const getOffice = async () => {
  try{
    if (storage.getOfficeId() == null) {
      storage.setLevel('ADMIN')
    } else {
      const response = await api.getMajlisById(storage.getOfficeId())
      storage.setOffice(response)
      if (response.office_delegation === 0) {
        storage.setLevel('PERWAKILAN')
      } else {
        storage.setLevel('CABANG')
      }
    }
    console.log('level', storage.getLevel())
  }catch(e:any){
    if (e.request.status === 400) {
      errorMessage.value = 'Email atau password salah'
    } else {
      errorMessage.value = 'Ups, terjadi kesalahan'
    }
  }
}

const clearErrorMessage = () => {
  errorMessage.value = ''
}
</script>
<template>
  <div>
    <img src="/decor_up.svg" class="decor-up" />
    <img src="/decor_down.svg" class="decor-down" />
    <div class="main">
      <img src="/logo.png" class="logo" />
      <div class="error" v-if="errorMessage.valueOf() !== ''" @click="clearErrorMessage()">
        {{ errorMessage }}
        <div class="spacer" />
        <img src="~/assets/cross_white.svg">
      </div>
      <form>
        <div class="form-input">
          <label>email</label>
          <input type="text" placeholder="someone@gmail.com" v-model="username" />
        </div>
        <div class="form-input">
          <label>kata sandi</label>
          <input type="password" placeholder="your password" v-model="password" />
        </div>
        <button type="button" @click="gotoNext()">masuk</button>
      </form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.error{
  background: red;
  padding: 10px;
  border-radius: 8px;
  color: white;
  font-family: 'Inter';
  font-size: 10pt;
  text-align: center;
  display: flex;
  align-items: center;
  .spacer{
    flex: 1;
  }
}
.decor-up{
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.decor-down{
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: -1;
}
.main{
  display: block;
  margin-top: 176px;
  margin-left: auto;
  margin-right: auto;
  width: 342px;
  .logo{
    margin-bottom: 48px;
  }
  .form-input{
    margin-top: 16px;
    label{
      display: block;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: #525252;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    input{
      width: 90%;
      padding: 16px;
      border: 1px solid #D0D0D0;
      border-radius: 4px;
    }
  }
  button{
    background: #007E42;
    width: 100%;
    padding: 24px;
    border: none;
    color: white;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-radius: 8px;
    margin-top: 48px;
    cursor: pointer;
  }
}
</style>