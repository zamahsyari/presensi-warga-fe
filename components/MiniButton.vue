<template>
  <button id="button">
    <img :src="image" />
    {{ label }}
  </button>
</template>
<script>
export default {
  props: {
    image: String,
    label: String    
  }
}
</script>
<style lang="scss" scoped>
#button{
  background: #00AA58;
  padding: 8px 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  height: 32px;
  border: none;
  img{
    height: 24px;
    width: 24px;
    margin-right: 8px;
  }
}
</style>