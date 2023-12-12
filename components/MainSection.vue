<template>
  <div id="section">
    <slot/>
  </div>
</template>
<style lang="scss" scoped>
#section{
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 32px;
  max-width: 736px;
}
</style>