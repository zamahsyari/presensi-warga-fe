<template>
  <div id="navbar">
    <img src="/logo.png" class="logo" />
    <div class="spacer" />
    <div class="user">
      <div class="frame">
        <img src="~/assets/person_black.svg" />
      </div>
      <b @click="toggleDropdown()">{{ user }}</b>
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
  padding: 16px 32px;
  color: white;
  display: flex;
  position: relative;
  box-shadow: 0px 0px 5px #000000;
  .logo{
    height: 32px;
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
    .frame{
      height: 32px;
      width: 32px;
      background: white;
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
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