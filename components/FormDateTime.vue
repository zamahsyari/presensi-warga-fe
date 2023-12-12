<template>
  <div id="form-input">
    <label>{{ label }}</label>
    <div class="inline">
      <div class="form-input">
        <VueDatePicker v-model="date" :model-value="date" time-picker-inline @update:model-value="handleDate" />
      </div>
    </div>
  </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { defineComponent } from "vue";

export default {
  components: {VueDatePicker},
  props: {
    label: String,
    placeholderDate: String,
    placeholderTime: String,
    modelValue: Date
  },
  setup(props, {emit}) {
    function updateValue(value){
      emit('update:modelValue', value)
    }
  },
  data () {
    return {
      date: ref(new Date())
    }
  },
  methods: {
    handleDate (modelData) {
      this.$emit('update:modelValue', modelData)
    }
  }
}
</script>
<style lang="scss" scoped>
#form-input{
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
      display: flex;
      .form-input{
        display: flex;
        position: relative;
        input{
          width: 100%;
          padding: 16px;
          border: 1px solid #D0D0D0;
          border-radius: 4px;
        }
        &:first-child{
          width: 60%;
        }
        &:last-child{
          width: 40%;
        }
        img{
          position: absolute;
          right: 0;
          top:0;
          margin-top: 12px;
          margin-right: 12px;
        }
      }
      .spacer{
        width: 16px;
      }
    }
  }
</style>