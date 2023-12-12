<script setup lang="ts">
import { Acara, Presence, Warga } from "~/composables/useApi"

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const storage = useStorage()
const api = useApi(config.public.API_BASE_URL, storage.getToken())

const acara:Ref<Acara|null> = useState('event', () => null)
const presences:Ref<Presence[]> = useState('presences', () => [])
const warga:Ref<Warga[]> = useState('warga', () => [])
const popupData:Ref<Presence[]> = useState('popupData', () => [])
const showPopup = useState('showPopup', () => false)

const togglePopup = () => {
  console.log('toggled popup')
  showPopup.value = !showPopup.value
}

const fetchPopupData = async (permitType:number) => {
  console.log('toggled popup')
  if (permitType !== 99) {
    popupData.value = presences.value.filter(item => item.permit_type === permitType)
  } else {
    popupData.value = []
    for(let i=0; i<warga.value.length; i++){
      const presenceIds:number[] = presences.value.map(item => item.member_id)
      if(!checkIfExist(warga.value[i].member_id, presenceIds)){
        popupData.value.push({
          id: 0,
          member_id: warga.value[i].member_id,
          event_id: acara.value ? acara.value?.id : 0,
          note: '',
          permit_type: 99,
          created_at: '',
          updated_at: '',
          office_name: acara.value ? acara.value?.office_name! : '',
          name: acara.value ? acara.value?.name : '',
          member_name: warga.value[i].member_name,
          member_gender: warga.value[i].member_gender,
        })
      }
    }
  }
  showPopup.value = !showPopup.value
}

const checkIfExist = (needle:number, haystack:number[]) => {
  for(let i=0; i<haystack.length; i++){
    if(haystack[i] === needle){
      return true
    }
  }
  return false
}

const gotoAdd = () => {
  router.push({
    path: '/presence',
    query: {
      eventId: route.query.eventId
    }
  })
}
onMounted(async () => {
  const eventId:string = route.query.eventId as string
  acara.value = await api.getEventById(parseInt(eventId))
  presences.value = await api.getPresences(parseInt(eventId))
  warga.value = await api.getWargaCabang(acara.value.office_id)
})

const formatDecimal = (val:number):string => {
    if (val < 10) return `0${val}`
    return `${val}`
}

const formatHour = (val:Date) => {
  return `${formatDecimal(val.getHours())}:${formatDecimal(val.getMinutes())}`
}

const roundNumber = (val:number) => {
  return val.toFixed(2)
}

</script>
<template>
  <div>
    <Transition>
      <div class="bg-popup" v-if="showPopup">
        <div class="body-popup">
          <img src="~/assets/cross_black.svg" @click="togglePopup()" />
          <div class="section">
            <ul>
              <li v-for="item in popupData" :key="item.member_id">
                <div class="frame">
                  <img src="~/assets/person.svg" />
                </div>
                <div class="caption">
                  <b>{{ item.member_name }}</b>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
    <div id="dashboard">
      <div class="container">
        <div class="navbar">
          <img src="~/assets/arrow_left.svg" class="back-btn" />
          <h3>Dashboard {{ acara?.name }}</h3>
          <div class="spacer" />
          <button @click="gotoAdd()">
            <img src="~/assets/plus_black.svg" />
            Tambah Kehadiran
          </button>
          <div class="user">
            <div class="frame">
              <img src="~/assets/person_black.svg" />
            </div>
            <b>Administrator</b>
          </div>
        </div>
        <div class="recap">
          <h2>Rekapitulasi Kehadiran</h2>
          <ul>
            <li>
              <div class="caption">
                <div class="left">
                  <b>Putra</b>
                  <div class="detail">
                    <i>Warga: {{ presences.filter(item => item.member_gender == 1).length }}/{{ warga.filter(item => item.member_gender == 1).length }}</i>
                    <i>Mustamik: 1</i>
                  </div>
                </div>
                <div class="spacer" />
                <div class="right">
                  {{ roundNumber(presences.filter(item => item.member_gender == 1).length / warga.filter(item => item.member_gender == 1).length * 100) }}%
                </div>
              </div>
            </li>
            <li>
              <div class="caption">
                <div class="left">
                  <b>Putri</b>
                  <div class="detail">
                    <i>Warga: {{ presences.filter(item => item.member_gender == 0).length }}/{{ warga.filter(item => item.member_gender == 0).length }}</i>
                    <i>Mustamik: 1</i>
                  </div>
                </div>
                <div class="spacer" />
                <div class="right">
                  {{ roundNumber(presences.filter(item => item.member_gender == 0).length / warga.filter(item => item.member_gender == 0).length * 100) }}%
                </div>
              </div>
            </li>
            <li>
              <div class="caption">
                <div class="left">
                  <b>Total Kehadiran</b>
                  <div class="detail">
                    <i>{{ presences.length }}/{{ warga.length }}</i>
                  </div>
                </div>
                <div class="spacer" />
                <div class="right">
                  {{ roundNumber(presences.length / warga.length * 100) }}%
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="main">
          <div class="presence">
            <h2>Daftar Kehadiran</h2>
            <ul>
              <li v-for="item in presences" :key="item.id">
                <div class="frame">
                  <img src="~/assets/person_black.svg"/>
                </div>
                <div class="caption">
                  <b>{{ item.member_name }}</b>
                  <i>{{ formatHour(new Date(item.updated_at)) }}</i>
                </div>
              </li>
            </ul>
          </div>
          <div class="detail">
            <h3>Total Tidak Hadir</h3>
            <b>{{ warga.length - presences.length + presences.filter(item => item.permit_type !== 0).length }}</b>
            <ul>
              <li>
                Sakit
                <label>{{ presences.filter(item => item.permit_type === 1).length }}</label>
                <div class="spacer" />
                <img src="~/assets/arrow_right_blue.svg" @click="fetchPopupData(1)" />
              </li>
              <li>
                Kerja
                <label>{{ presences.filter(item => item.permit_type === 2).length }}</label>
                <div class="spacer" />
                <img src="~/assets/arrow_right_blue.svg" @click="fetchPopupData(2)" />
              </li>
              <li>
                Pulang Kampung
                <label>{{ presences.filter(item => item.permit_type === 3).length }}</label>
                <div class="spacer" />
                <img src="~/assets/arrow_right_blue.svg" @click="fetchPopupData(3)" />
              </li>
              <li>
                Lain-lain
                <label>{{ presences.filter(item => item.permit_type === 4).length }}</label>
                <div class="spacer" />
                <img src="~/assets/arrow_right_blue.svg" @click="fetchPopupData(4)" />
              </li>
              <li>
                Tanpa Keterangan
                <label>{{ warga.length - presences.length }}</label>
                <div class="spacer" />
                <img src="~/assets/arrow_right_blue.svg" @click="fetchPopupData(99)" />
              </li>
            </ul>
          </div>
        </div>
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
        }
      }
    }
  }
}
#dashboard{
  font-family: Inter;
  background: #F5F5F5;
  min-height: 100vh;
  .container{
    max-width: 1024px;
    display: block;
    margin: 0 auto;
    .navbar{
      padding-top: 42px;
      display: flex;
      align-items: center;
      h3{
        font-size: 20px;
      }
      .back-btn{
        margin-right: 16px;
      }
      .spacer{
        flex: 1;
      }
      button{
        cursor: pointer;
        border: 1px solid black;
        border-radius: 8px;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        margin-right: 8px;
        font-weight: bold;
        img{
          margin-right: 8px;
        }
      }
      .user{
        display: flex;
        align-items: center;
        .frame{
          margin-right: 8px;
          border: 1px solid black;
          border-radius: 100px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        b{
          font-size: 14px;
        }
      }
    }
    .recap{
      h2{
        font-size: 16px;
      }
      ul{
        margin-left: -40px;
        li{
          display: inline-block;
          width: 333px;
          margin-right: 11px;
          .caption{
            background: #00AA58;
            padding: 16px;
            border-radius: 8px;
            display: flex;
            color: white;
            .spacer{
              flex: 1;
            }
            .left{
              font-size: 14px;
            }
            .right{
              font-size: 40px;
            }
            i{
              font-style: normal;
              display: block;
            }
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .main{
      display: flex;
      .presence{
        h2{
          font-size: 16px;
        }
        flex: 1;
        ul{
          margin-left: -40px;
          li{
            display: flex;
            padding: 8px;
            border-top: 1px solid #D9D9D9;
            align-items: center;
            .frame{
              width: 48px;
              height: 48px;
              background: #D9D9D9;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              margin-right: 16px;
              img{
                height: 28px;
              }
            }
            .caption{
              b{
                display: block;
              }
            }
            &:last-child{
              border-bottom: 1px solid #D9D9D9;
            }
          }
        }
      }
      .detail{
        background: white;
        padding: 16px;
        margin-left: 16px;
        width: 256px;
        height: 100%;
        border-radius: 8px;
        h3{
          font-size: 16px;
          margin: 0;
        }
        b{
          display: block;
          font-size: 40px;
          text-align: center;
          margin-top: 32px;
          margin-bottom: 32px;
        }
        ul{
          margin-left: -40px;
          li{
            display: flex;
            padding-top: 8px;
            padding-bottom: 8px;
            border-top: 1px solid #D9D9D9;
            label{
              background: #D9D9D9;
              padding: 2px 11px;
              border-radius: 20px;
              margin-left: 8px;
            }
            .spacer{
              flex: 1;
            }
            &:last-child{
              border-bottom: 1px solid #D9D9D9;
            }
          }
        }
      }
    }
  }
}
</style>