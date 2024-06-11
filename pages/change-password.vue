<script setup lang="ts">
import { ChangePasswordRequest, Gelombang, Majlis } from "~/composables/useApi"

type Option = {
  id: number
  key: string
  value: string
}

const router = useRouter()
const goBack = () => {
  router.back()
}
const config = useRuntimeConfig()
const storage = useStorage()
const api = useApi(config.public.API_BASE_URL, storage.getToken())
// form
const password = useState('password', () => '')
const rePassword = useState('re-password', () => '')

const submit = async () => {
  const payload: ChangePasswordRequest = {
    user_id: storage.getUserId(),
    user_name: storage.getUsername(),
    user_password: password.value
  }
  if (storage.getLevel() === 'ADMIN') {
    await api.putNewAdminPassword(storage.getUserId(), payload)
  } else {
    await api.putNewOfficePassword(storage.getUserId(), payload)
  }
  storage.setToken('')
  router.push('/')
}
</script>
<template>
  <div id="page">
    <Navbar user="Administrator" />
    <div class="topbar">
      <img src="~/assets/arrow_left.svg" @click="goBack()" />
      <h3>Ganti Password</h3>
    </div>
    <MainSection class="main">
      <form>
        <FormInput label="Password baru" placeholder="contoh: rahasia" v-model="password" inputType="password" />
        <FormInput label="Ulangi password baru" placeholder="contoh: rahasia" v-model="rePassword" inputType="password" />
        <FormButton title="simpan" class="btn" @click="submit" />
      </form>
    </MainSection>
  </div>
</template>
<style lang="scss" scoped>
#page{
  background: #f5f5f5;
  padding-bottom: 64px;
  .topbar{
    width: 800px;
    display: block;
    margin: auto;
    display: flex;
    align-items: center;
    margin-top: 32px;
    margin-bottom: 32px;
    .spacer{
      flex: 1;
    }
    h3{
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      color: #000000;
      margin: 0;
      margin-left: 16px;
    }
  }
  .main{
    margin: 0 auto;
    width: 800px;
    .btn{
      margin-top: 48px;
    }
  }
}
</style>