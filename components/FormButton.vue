<template>
  <div id="btn">
    <button type="button">
      {{ title }}
    </button>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  }
}
</script>
<style lang="scss" scoped>
#btn{
  margin-top: 16px;
  button{
    background: #007E42;
    padding: 16px 48px;
    border: none;
    color: white;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>