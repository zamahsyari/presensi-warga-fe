<script setup lang="ts">
import { Acara } from "~/composables/useApi"

const router = useRouter()
const config = useRuntimeConfig()
const storage = useStorage()
const api = useApi(config.public.API_BASE_URL, storage.getToken())

const data = useState<Acara[]>('data', () => [])
const todays = useState<Acara[]>('today', () => [])
const others = useState<Acara[]>('others', () => [])

const q = useState('q', () => '')

const formatTimeRangeNow = (startDate:Date, endDate:Date) => {
  return `${formatDecimal(startDate.getHours())}:${formatDecimal(startDate.getMinutes())} - ${formatDecimal(endDate.getHours())}:${formatDecimal(endDate.getMinutes())}`
}

const formatTimeRange = (startDate:Date, endDate:Date) => {
  return `${startDate.getDate()} ${formatMonth(startDate.getMonth())} ${startDate.getFullYear()} | ${formatDecimal(startDate.getHours())}:${formatDecimal(startDate.getMinutes())} - ${formatDecimal(endDate.getHours())}:${formatDecimal(endDate.getMinutes())}`
}

const gotoNext = async (eventId:number) => {
  router.push({
    path: "/dashboard",
    query: {
      eventId: eventId
    }
  })
}

const gotoAdd = async () => {
  router.push({
    path: "/add-event"
  })
}

const formatDecimal = (val:number):string => {
    if (val < 10) return `0${val}`
    return `${val}`
}

const refreshData = async () => {
  console.log('refreshData...')
  todays.value = []
  others.value = []
  if (storage.getLevel() === 'ADMIN') {
    data.value = await api.getEvents(q.value, 0)
  } else {
    data.value = await api.getEvents(q.value, storage.getOfficeId())
  }
  console.log('data', data.value)
  data.value.map(item => {
    const now = new Date()
    const nowDate = `${formatDecimal(now.getFullYear())}-${formatDecimal(now.getMonth() + 1)}-${formatDecimal(now.getDate())}`
    const itemStart = new Date(item.start_at)
    const itemDate = `${formatDecimal(itemStart.getFullYear())}-${formatDecimal(itemStart.getMonth() + 1)}-${formatDecimal(itemStart.getDate())}`
    if (nowDate === itemDate) {
      todays.value.push(item)
    }else{
      others.value.push(item)
    }
  })
}

const formatMonth = (val:number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return months[val]
}

const onKeyup = (e:any) => {
  if(q.value.length < 1 || q.value.length > 3) {
    refreshData()
  }
}

onMounted(async () => {
  refreshData()
})
</script>
<template>
  <div id="page">
    <Navbar :user="storage.getUsername()" />
    <div class="topbar">
      <h3>Pilih Acara</h3>
      <div class="spacer" />
      <MiniButton image="/_nuxt/assets/plus.svg" label="Tambah acara" @click="gotoAdd()" />
    </div>
    <MainSection class="main">
      <Searchbar label="Cari nama acara/kajian/gelombang..." v-model="q" @keyup="(e) => onKeyup(e)" />
      <div class="content">
        <div class="section">
          <h3>Hari Ini</h3>
          <ul>
            <li v-for="item in todays" :key="item.id" @click="gotoNext(item.id)">
              <ListItem image="/_nuxt/assets/book.svg" :title="item.name" :caption="formatTimeRangeNow(new Date(item.start_at), new Date(item.end_at))" />
            </li>
          </ul>
        </div>
        <div class="section">
          <h3>Akan Datang</h3>
          <ul>
            <li v-for="item in others" :key="item.id" @click="gotoNext(item.id)">
              <ListItem image="/_nuxt/assets/book.svg" :title="item.name" :caption="formatTimeRange(new Date(item.start_at), new Date(item.end_at))" />
            </li>
          </ul>
        </div>
      </div>
    </MainSection>
  </div>
</template>
<style lang="scss" scoped>
#page{
  height: 1vh;
  .topbar{
    width: 800px;
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
      color: #5e5e5e;
      margin: 0;
    }
  }
  .main{
    margin: 0 auto;
    width: 800px;
  }
}
.content{
  width: 800px;
  display: block;
  margin: auto;
  h3{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    margin-top: 32px;
    color: #5e5e5e;
  }
  ul{
    margin-left: -40px;
    width: 736px;
    li{
      list-style: none;
      &:first-child{
        border-top: 1px solid #D0D0D0;
      }
      &:hover{
        cursor: pointer;
        background: #f5f5f5;
      }
    }
  }
}
</style>