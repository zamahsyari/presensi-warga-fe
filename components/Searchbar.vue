<template>
  <div class="search-bar">
    <input type="text" :placeholder="label" :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
    <img src="~/assets/search.svg" />
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])
</script>
<style lang="scss" scoped>
.search-bar{
  display: block;
  margin: auto;
  position: relative;
  input{
    width: 96%;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #D0D0D0;
  }
  img{
    position: absolute;
    right: 0;
    margin-top: -35px;
    margin-right: 16px;
  }
}
</style>