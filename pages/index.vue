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
    storage.setFullname(response.name)
    storage.setUsername(response.username)
    storage.setUserId(response.id)
    api = useApi(config.public.API_BASE_URL, storage.getToken())
    return true
  }catch(e:any){
    console.log('error', e)
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
        <button type="button" @click="gotoNext()">MASUK</button>
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
  background: white;
  padding: 32px;
  text-align: center;
  border: 1px solid #D0D0D0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, .1) 0 2px 4px 0;
  .logo{
    margin-bottom: 48px;
    height: 128px;
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
      text-align: left;
    }
    input{
      width: 90%;
      padding: 16px;
      border: 1px solid #D0D0D0;
      border-radius: 4px;
    }
  }
  button{
    margin-top: 32px;
    width: 100%;
    background-color: #13aa52;
    border: 1px solid #13aa52;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, .1) 0 2px 4px 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-family: "Akzidenz Grotesk BQ Medium", -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    font-weight: 400;
    outline: none;
    outline: 0;
    padding: 10px 25px;
    text-align: center;
    transform: translateY(0);
    transition: transform 150ms, box-shadow 150ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

    &:hover{
      box-shadow: rgba(0, 0, 0, .15) 0 3px 9px 0;
      transform: translateY(-2px);
    }
  }
}
</style>