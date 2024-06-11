<template>
  <div id="navbar">
    <div class="logo">
      <img src="/logo.png" />
      <h2>Presensi</h2>
    </div>
    <div class="spacer" />
    <div class="user" @click="toggleDropdown()">
      <div class="frame">
        <img src="~/assets/person_black.svg" />
      </div>
      <b>{{ user }}</b>
      <ul v-if="showDropdown">
        <li @click="changePassword()">Ganti Password</li>
        <li @click="logout()">Keluar</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: String
  },
  data () {
    return {
      showDropdown: false
    }
  },
  methods: {
    toggleDropdown () {
      this.showDropdown = !this.showDropdown
    },
    changePassword () {
      const router = useRouter()
      router.push('/change-password')
    },
    logout () {
      const storage = useStorage()
      const router = useRouter()
      storage.setToken('')
      router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
#navbar{
  background: #00AA58;
  background: white;
  padding: 4px 32px;
  color: #5e5e5e;
  display: flex;
  position: relative;
  border-bottom: 1px solid #d1d1d1;
  // box-shadow: 0px 0px 5px #000000;
  .logo{
    height: 32px;
    padding: 8px;
    display: flex;
    gap: 16px;
    img{
      height: 100%;
      display: inline-block;
    }
    h2{
      color: #5e5e5e;
      font-family: 'Inter';
      font-weight: 600;
      margin: 0;
      display: inline-block;
    }
  }
  .spacer{
    flex: 1;
  }
  .user{
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    &:hover{
      background: #d1d1d1;
    }
    .frame{
      height: 32px;
      width: 32px;
      background: white;
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      border: 1px solid #818181;
    }
    ul{
      cursor: pointer;
      display: block;
      position: absolute;
      right: 16px;
      top: 48px;
      background: white;
      min-width: 128px;
      box-shadow: 0px 0px 5px #555;
      border-radius: 4px;
      li{
        color: black;
        padding: 16px;
        list-style: none;
        margin: 0;
        margin-left: -40px;
        cursor: pointer;
        &:hover{
          background: #00AA58;
          color: white;
        }
      }
    }
  }
}
</style>