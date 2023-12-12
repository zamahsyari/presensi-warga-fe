<template>
  <div id="form-select">
    <label>{{ label }}</label>
    <select @change="(e) => onChange !== undefined ? onChange(e) : false">
      <option disabled>{{ placeholder }}</option>
      <option v-for="item in data" :key="item.key" :value="item.key">
        {{ item.value }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    placeholder: String,
    data: Array,
    onChange: Function
  }
}
</script>
<style lang="scss" scoped>
#form-select{
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
    select{
      width: 100%;
      padding: 16px;
      border: 1px solid #D0D0D0;
      border-radius: 4px;
    }
  }
</style>