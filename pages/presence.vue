<script setup lang="ts">
import { Acara, Presence, Warga } from '~/composables/useApi'

const showPopup = useState('showPopup', () => false)
const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const showAbsence = useState('showAbsence', () => false)
const toggleAbsence = () => {
  showAbsence.value = !showAbsence.value
}

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const storage = useStorage()
const api = useApi(config.public.API_BASE_URL, storage.getToken())

const presences = useState<Presence[]>('presences', () => [])
const acara = useState<Acara|null>('event', () => null)
const warga = useState<Warga[]>('warga', () => [])

const officeId = useState('officeId', () => 0)
const q = useState('q', () => '')
const permitType = useState('permitType', () => 0)
const note = useState('note', () => '')

const searchInput = ref(null)

onMounted(async () => {
  const eventId:number = route.query.eventId !== null ? parseInt(route.query.eventId.toString()) : 0
  presences.value = await api.getPresences(eventId)
  acara.value = await api.getEventById(eventId)
  officeId.value = acara.value.office_id
  warga.value = await api.getWargaCabang(officeId.value)
})

const searchWarga = async (q:string) => {
  if(q.length < 1 || q.length > 3){
    warga.value = await api.getWargaCabang(officeId.value, q)
  }
}

const submitHadir = async (memberId:number) => {
  const eventId:number = route.query.eventId !== null ? parseInt(route.query.eventId.toString()) : 0
  await api.postPresence({
    member_id: memberId,
    event_id: eventId,
    permit_type: 0,
    note: '',
  })
  presences.value = await api.getPresences(eventId)
}

const deletePresence = async (id:number) => {
  const eventId:number = route.query.eventId !== null ? parseInt(route.query.eventId.toString()) : 0
  await api.deletePresence(id)
  presences.value = await api.getPresences(eventId)
}

</script>
<template>
  <div>
    <Transition>
      <div class="bg-popup" v-if="showPopup">
        <div class="body-popup">
          <img src="~/assets/cross_black.svg" @click="togglePopup()" />
          <div class="search-bar">
            <input type="text" placeholder="Cari nama warga" v-model="q" @keyup="searchWarga(q)" />
            <img src="~/assets/search.svg" />
          </div>
          <div class="section">
            <ul>
              <li v-for="item in warga" :key="item.member_id">
                <div class="frame">
                  <img src="~/assets/person.svg" />
                </div>
                <div class="caption">
                  <b>{{ item.member_name }}</b>
                </div>
                <div class="spacer" />
                <button @click="submitHadir(item.member_id)">hadir</button>
                <button @click="toggleAbsence()">tidak hadir</button>
                <div class="absence" v-if="showAbsence">
                  <ul>
                    <li>
                      <button>sakit</button>
                      <button>kerja</button>
                      <button>pulang kampung</button>
                      <button>lain-lain</button>
                    </li>
                    <input type="text" v-model="note" placeholder="Keterangan" />
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
    <div class="bg-top" />
    <div class="topbar">
      <h3>Daftar Kehadiran</h3>
      <div class="spacer" />
      <img src="~/assets/plus.svg" @click="togglePopup" />
      <a href="/add-guest">Tambah Mustamik</a>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Cari nama warga" v-model="q" @keyup="searchWarga(q)" ref="searchInput" />
      <img src="~/assets/search.svg" />
    </div>
    <div class="content">
      <div class="section">
        <h3>Hadir ({{ presences.filter(item => item.permit_type == 0).length }})</h3>
        <ul>
          <li v-for="item in presences.filter(item => item.permit_type == 0)" :key="item.id">
            <div class="frame">
              <img src="~/assets/person.svg" />
            </div>
            <div class="caption">
              <b>{{ item.member_name }}</b>
              <i>{{ item.updated_at }}</i>
            </div>
            <div class="spacer" />
            <img src="~/assets/cross_black.svg" @click="deletePresence(item.id)" />
          </li>
        </ul>
      </div>
      <div class="section">
        <h3>Sakit ({{ presences.filter(item => item.permit_type == 1).length }})</h3>
        <ul>
          <li v-for="item in presences.filter(item => item.permit_type == 1)" :key="item.id">
            <div class="frame">
              <img src="~/assets/person.svg" />
            </div>
            <div class="caption">
              <b>{{ item.member_name }}</b>
              <i>{{ item.updated_at }}</i>
            </div>
            <div class="spacer" />
            <img src="~/assets/cross_black.svg" @click="deletePresence(item.id)" />
          </li>
        </ul>
      </div>
      <div class="section">
        <h3>Kerja ({{ presences.filter(item => item.permit_type == 2).length }})</h3>
        <ul>
          <li v-for="item in presences.filter(item => item.permit_type == 2)" :key="item.id">
            <div class="frame">
              <img src="~/assets/person.svg" />
            </div>
            <div class="caption">
              <b>{{ item.member_name }}</b>
              <i>{{ item.updated_at }}</i>
            </div>
            <div class="spacer" />
            <img src="~/assets/cross_black.svg" @click="deletePresence(item.id)" />
          </li>
        </ul>
      </div>
      <div class="section">
        <h3>Pulang Kampung ({{ presences.filter(item => item.permit_type == 3).length }})</h3>
        <ul>
          <li v-for="item in presences.filter(item => item.permit_type == 3)" :key="item.id">
            <div class="frame">
              <img src="~/assets/person.svg" />
            </div>
            <div class="caption">
              <b>{{ item.member_name }}</b>
              <i>{{ item.updated_at }}</i>
            </div>
            <div class="spacer" />
            <img src="~/assets/cross_black.svg" @click="deletePresence(item.id)" />
          </li>
        </ul>
      </div>
      <div class="section">
        <h3>Lain-lain ({{ presences.filter(item => item.permit_type == 4).length }})</h3>
        <ul>
          <li v-for="item in presences.filter(item => item.permit_type == 4)" :key="item.id">
            <div class="frame">
              <img src="~/assets/person.svg" />
            </div>
            <div class="caption">
              <b>{{ item.member_name }}</b>
              <i>{{ item.updated_at }}</i>
            </div>
            <div class="spacer" />
            <img src="~/assets/cross_black.svg" @click="deletePresence(item.id)" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bg-popup{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2;
  overflow: scroll;
  .body-popup{
    width: 640px;
    padding: 16px;
    border-radius: 8px;
    background: white;
    z-index: 3;
    position: relative;
    margin: 92px auto;
    .search-bar{
      input{
        width: 75%;
      }
    }
    ul{
      margin-left: -40px;
      li{
        list-style: none;
        display: flex;
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #D0D0D0;
        align-items: center;
        .frame{
          width: 40px;
          height: 40px;
          background: #D9D9D9;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          margin-right: 8px;
        }
        .caption{
          b{
            display: block;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 15px;
          }
          i{
            font-family: 'Inter';
            font-style: normal;
            font-weight: 300;
            font-size: 10px;
            line-height: 12px;
          }
        }
        .spacer{
          flex: 1;
        }
        button{
          background: #007E42;
          padding: 8px 16px;
          border: none;
          color: white;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 19px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 8px;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
  }
}
.bg-top{
  background: #00AA58;
  height: 96px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.topbar{
  width: 800px;
  display: block;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  a{
    text-decoration: none;
    color: white;
    margin: 8px;
    font-family: 'Inter';
  }
  .spacer{
    flex: 1;
  }
  h3{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: white;
  }
}
.search-bar{
  width: 800px;
  display: block;
  margin: auto;
  position: relative;
  input{
    width: 97%;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #D0D0D0;
  }
  img{
    position: absolute;
    right: 0;
    margin-top: -35px;
    margin-right: 8px;
  }
}
.content{
  width: 800px;
  display: block;
  margin: auto;
  h3{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin-top: 16px;
  }
  ul{
    margin-left: -40px;
    li{
      list-style: none;
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #D0D0D0;
      align-items: center;
      .frame{
        width: 40px;
        height: 40px;
        background: #D9D9D9;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-right: 8px;
      }
      .caption{
        b{
          display: block;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 15px;
        }
        i{
          font-family: 'Inter';
          font-style: normal;
          font-weight: 300;
          font-size: 10px;
          line-height: 12px;
        }
      }
      .spacer{
        flex: 1;
      }
      label{
        &.active{
          background: #00AA58;
          height: 8px;
          width: 8px;
          border-radius: 8px;
          display: block;
        }
        &.inactive{
          background: #525252;
          height: 8px;
          width: 8px;
          border-radius: 8px;
          display: block;
        }
      }
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>