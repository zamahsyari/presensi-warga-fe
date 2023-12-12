<template>
  <div id="list-item">
    <div class="frame">
      <img :src="image" />
    </div>
    <div class="caption">
      <b>{{ title }}</b>
      <i>{{ caption }}</i>
    </div>
    <div class="spacer" />
  </div>
</template>
<script>
export default {
  props: {
    image: String,
    title: String,
    caption: String
  }
}
</script>
<style lang="scss" scoped>
#list-item{
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
}
</style>