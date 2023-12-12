<script setup lang="ts">
import { Acara, Gelombang, Majlis } from "~/composables/useApi"

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
const perwakilan = useState<Majlis[]>('perwakilan', () => [])
const perwakilanOptions = useState<Option[]>('perwakilan_options', () => [])
const cabang = useState<Majlis[]>('cabang', () => [])
const cabangOptions = useState<Option[]>('cabang_options', () => [])
const gelombang = useState<Gelombang[]>('gelombang', () => [])
const gelombangOptions = useState<Option[]>('gelombang_options', () => [])
const interval = useState<string[]>('interval', () => [])
const intervalOptions = useState<Option[]>('interval_options', () => [])
// form
const selectedPerwakilan = useState<string>('selected_perwakilan', () => '')
const selectedCabang = useState<string>('selected_cabang', () => '')
const selectedGelombang = useState<string>('selected_gelombang', () => '')
const selectedInterval = useState<string>('selected_interval', () => 'SEKALI')
const name = useState('name', () => '')
const description = useState('description', () => '')
const startAt = useState('start_at', () => new Date())
const endAt = useState('end_at', () => new Date())

const setSelectedPerwakilan = async (e:any) => {
  selectedPerwakilan.value = e.target.value
  cabangOptions.value = []
  cabang.value = await api.getCabangByPerwakilan(e.target.value)
  for(let i=0; i<cabang.value.length; i++){
    cabangOptions.value.push({
      id: cabang.value[i].office_id,
      key: `${cabang.value[i].office_id}`,
      value: cabang.value[i].office_name
    })
  }
  gelombangOptions.value = []
  gelombang.value = await api.getGelombang(e.target.value)
  for(let i=0; i<gelombang.value.length; i++){
    gelombangOptions.value.push({
      id: gelombang.value[i].id,
      key: `${gelombang.value[i].id}`,
      value: gelombang.value[i].label
    })
  }
}

const setSelectedCabang = async (e:any) => {
  selectedCabang.value = e.target.value
  gelombangOptions.value = []
  gelombang.value = await api.getGelombang(e.target.value)
  for(let i=0; i<gelombang.value.length; i++){
    gelombangOptions.value.push({
      id: gelombang.value[i].id,
      key: `${gelombang.value[i].id}`,
      value: gelombang.value[i].label
    })
  }
}

const setSelectedGelombang = async (e:any) => {
  selectedGelombang.value = e.target.value
}

const setSelectedInterval = async (e:any) => {
  selectedInterval.value = e.target.value
}

onMounted(async () => {
  perwakilan.value = []
  perwakilan.value = await api.getPerwakilan()
  perwakilanOptions.value.push({
    id: 0,
    key: '',
    value: '--Pilih Perwakilan--'
  })
  for(let i=0; i<perwakilan.value.length; i++){
    perwakilanOptions.value.push({
      id: perwakilan.value[i].office_id,
      key: perwakilan.value[i].office_code,
      value: perwakilan.value[i].office_name
    })
  }
  perwakilanOptions.value = perwakilanOptions.value.sort((a, b) => {
    if (a.value < b.value) return -1
    return 1
  })
  intervalOptions.value.push({
    id: 1,
    key: 'SEKALI',
    value: 'Hanya Sekali'
  })
  intervalOptions.value.push({
    id: 2,
    key: 'HARIAN',
    value: 'Setiap Hari'
  })
  intervalOptions.value.push({
    id: 3,
    key: 'MINGGUAN',
    value: 'Setiap Pekan'
  })
  intervalOptions.value.push({
    id: 4,
    key: 'BULANAN',
    value: 'Setiap Bulan'
  })
  intervalOptions.value.push({
    id: 5,
    key: 'TAHUNAN',
    value: 'Setiap Tahun'
  })
  if (storage.getLevel() === 'PERWAKILAN') {
    setSelectedPerwakilan({
      target: {
        value: storage.getOfficeId()
      }
    })
  }
  if (storage.getLevel() === 'CABANG') {
    setSelectedCabang({
      target: {
        value: storage.getOfficeId()
      }
    })
  }
})

const submit = async () => {
  const data:Acara = {
    id: 0,
    name: name.value,
    description: description.value,
    office_id: selectedCabang.value === '' ? parseInt(selectedPerwakilan.value) : parseInt(selectedCabang.value),
    session_id: selectedGelombang.value === '' ? null : parseInt(selectedGelombang.value),
    start_at: startAt.value.toISOString(),
    end_at: endAt.value.toISOString(),
    is_active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    interval: selectedInterval.value
  }
  await api.postEvent(data)
  router.push({
    path: "/event"
  })
}
</script>
<template>
  <div id="page">
    <Navbar user="Administrator" />
    <div class="topbar">
      <img src="~/assets/arrow_left.svg" @click="goBack()" class="back" />
      <h3>Tambah Acara</h3>
    </div>
    <MainSection class="main">
      <form>
        <div v-if="storage.getLevel() === 'ADMIN'">
          <FormSelect label="Pilih Perwakilan" placeholder="--Pilih Perwakilan--" :data="perwakilanOptions" :on-change="(e) => setSelectedPerwakilan(e)" />
          <FormSelect label="Pilih Cabang" placeholder="--Pilih Cabang--" :data="cabangOptions" :on-change="(e) => setSelectedCabang(e)" />
        </div>
        <div v-if="storage.getLevel() === 'PERWAKILAN'">
          <FormSelect label="Pilih Cabang" placeholder="--Pilih Cabang--" :data="cabangOptions" :on-change="(e) => setSelectedCabang(e)" />
        </div>
        <FormSelect label="Pilih Gelombang" placeholder="--Pilih Gelombang--" :data="gelombangOptions" :on-change="(e) => setSelectedGelombang(e)" />
        <FormInput label="Nama Acara" placeholder="contoh: Kajian Gelombang" v-model="name" />
        <FormTextarea label="Deskripsi Acara" placeholder="contoh: Kajian rutin tiap sabtu sore" v-model="description" />
        <FormDateTime label="Waktu Mulai" placeholderDate="yyyy-mm-dd" placeholderTime="hh:mm" v-model="startAt" />
        <FormDateTime label="Waktu Selesai" placeholderDate="yyyy-mm-dd" placeholderTime="hh:mm" v-model="endAt" />
        <FormSelect label="Pilih Interval" placeholder="--Pilih Interval--" :data="intervalOptions" :on-change="(e) => setSelectedInterval(e)" />
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
    .back{
      cursor: pointer;
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