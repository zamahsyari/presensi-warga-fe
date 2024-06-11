<template>
  <div id="form-input">
    <label>{{ label }}</label>
    <input v-if="inputType === undefined || inputType === 'text'" type="text" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" />
    <input v-if="inputType === 'password'" type="password" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    placeholder: String,
    modelValue: String,
    inputType: String
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
    input{
      width: 96%;
      padding: 16px;
      border: 1px solid #D0D0D0;
      border-radius: 4px;
    }
  }
</style>