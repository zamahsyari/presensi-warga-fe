<script setup lang="ts">
import { Gelombang, Majlis } from "~/composables/useApi"

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
const gender = useState<string>('gender', () => 'L')
const genderOptions = useState<Option[]>('gender_options', () => [])
// form
const selectedPerwakilan = useState<string>('selected_perwakilan', () => '')
const selectedCabang = useState<string>('selected_cabang', () => '')
const selectedGender = useState<string>('selected_gender', () => 'L')
const name = useState('name', () => '')
const phone = useState('phone', () => '')
const address = useState('address', () => '')
const isMustamik = useState('is_mustamik', () => 1)

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
}

const setSelectedCabang = async (e:any) => {
  selectedCabang.value = e.target.value
}

const setSelectedGender = async (e:any) => {
  selectedGender.value = e.target.value
}

onMounted(async () => {
  perwakilan.value = await api.getPerwakilan()
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
  genderOptions.value.push({
    id: 1,
    key: 'L',
    value: 'Laki-laki'
  })
  genderOptions.value.push({
    id: 2,
    key: 'P',
    value: 'Perempuan'
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

const onChangeMustamik = (e:any) => {
  isMustamik.value = parseInt(e.target.value)
}

const submit = async () => {
  let officeId = 0
  if (selectedCabang.value !== '') {
    officeId = parseInt(selectedCabang.value)
  } else {
    officeId = parseInt(selectedPerwakilan.value)
  }
  await api.postWarga({
    member_id: 0,
    office_id: officeId,
    delegation_id: 0,
    member_name: name.value,
    member_gender: gender.value === 'L' ? 1 : 2,
    member_address: address.value,
    member_phone: phone.value,
    member_mustamik: isMustamik.value
  })
}
</script>
<template>
  <div id="page">
    <Navbar user="Administrator" />
    <div class="topbar">
      <img src="~/assets/arrow_left.svg" @click="goBack()" />
      <h3>Tambah Mustamik</h3>
    </div>
    <MainSection class="main">
      <form>
        <FormInput label="Nama" placeholder="contoh: Ahmad" v-model="name" input-type="password" />
        <FormInput label="Alamat" placeholder="contoh: Jl Jalak 3" v-model="address" />
        <FormInput label="No Telp" placeholder="contoh: 0800000000" v-model="phone" />
        <FormSelect label="Pilih Jenis Kelamin" placeholder="--Pilih Jenis Kelamin--" :data="genderOptions" :on-change="(e) => setSelectedGender(e)" />
        <div v-if="storage.getFullname() === 'ADMIN'">
          <FormSelect label="Pilih Perwakilan" placeholder="--Pilih Perwakilan--" :data="perwakilanOptions" :on-change="(e) => setSelectedPerwakilan(e)" />
          <FormSelect label="Pilih Cabang" placeholder="--Pilih Cabang--" :data="cabangOptions" :on-change="(e) => setSelectedCabang(e)" />
        </div>
        <div v-if="storage.getLevel() === 'PERWAKILAN'">
          <FormSelect label="Pilih Cabang" placeholder="--Pilih Cabang--" :data="cabangOptions" :on-change="(e) => setSelectedCabang(e)" />
        </div>
        <div class="form-input">
          <label>Status Warga</label>
          <div class="inline">
            <input type="radio" value="0" name="is_mustamik" @change="onChangeMustamik">
            Warga
          </div>
          <div class="inline">
            <input type="radio" value="1" name="is_mustamik" @change="onChangeMustamik">
            Mustamik
          </div>
        </div>
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
        margin-bottom: 8px;
      }
      .inline{
        display: block;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
      }
      input{
        display: inline-block;
        padding: 16px;
        border: 1px solid #D0D0D0;
        border-radius: 4px;
      }
    }
  }
}
</style>