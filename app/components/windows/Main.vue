<template>
  <div
    class="main"
    id="mainWrapper"
    @drop="onDropHandler"
    :class="{ isCompactMode: isCompactMode }"
  >
    <title-bar class="main-title" :title="title" />
    <div class="main-contents">
      <side-nav v-if="page !== 'Onboarding'" :locked="applicationLoading"></side-nav>
      <div class="main-middle" v-if="showMainMiddle">
        <div v-if="shouldLockContent" class="main-loading">
          <custom-loader></custom-loader>
        </div>

        <component
          v-if="!shouldLockContent"
          class="main-page-container"
          :is="page"
          :params="params"
        />
        <studio-footer v-if="page !== 'Onboarding'" :locked="applicationLoading" />
      </div>
      <div class="nicolive-area" v-if="showNicoliveArea">
        <nicolive-area />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Main.vue.ts"></script>

<style lang="less" scoped>
@import '../../styles/index';

.main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-title {
  flex-shrink: 0;
}

.main-contents {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.main-middle {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.main-page-container {
  /* Page always takes up remaining space */
  flex-grow: 1;
  display: flex;
  position: relative;
}

.main-loading {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
