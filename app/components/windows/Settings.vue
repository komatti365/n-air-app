<template>
<modal-layout
  bare-content
  :show-cancel="false"
  :done-handler="done">

  <div slot="content" class="settings" data-test="Settings">
    <NavMenu v-model="categoryName" class="side-menu" data-test="SideMenu">
      <NavItem
        v-for="category in categoryNames"
        :key="category"
        :to="category"
        :ico="icons[category]"
        :data-test="category"
      >
        {{ $t(`settings.${category}.name`, { fallback: category }) }}
      </NavItem>
    </NavMenu>
    <div class="settings-container" ref="settingsContainer">
      <aside class="notice-section" v-if="isStreaming">
        <p class="notice-message">
          <i class="icon-warning"/>{{ $t('settings.noticeWhileStreaming')}}
        </p>
      </aside>
      <aside class="notice-section" v-if="categoryName === 'Stream'">
        <p class="notice-message">
          <i class="icon-warning"/><i18n path="settings.noticeForStreaming">
            <br place="br" />
          </i18n>
        </p>
      </aside>

      <extra-settings v-if="categoryName === 'General'" />
      <language-settings v-if="categoryName === 'General'" />
      <hotkeys v-if="categoryName === 'Hotkeys'" />
      <api-settings v-if="categoryName === 'API'" />
      <notifications-settings v-if="categoryName === 'Notifications'" />
      <appearance-settings v-if="categoryName === 'Appearance'" />
      <experimental-settings v-if="categoryName === 'Experimental'" />
      <GenericFormGroups
        v-if="!['Hotkeys', 'API', 'Notifications', 'Appearance', 'Experimental'].includes(categoryName)"
        v-model="settingsData"
        :category="categoryName"
        @input="save" />
    </div>
  </div>
</modal-layout>
</template>

<script lang="ts" src="./Settings.vue.ts"></script>

<style lang="less" scoped>
@import "../../styles/index";

.settings {
  display: flex;
  align-content: stretch;
  align-items: stretch;
  height: 100%;
  overflow: hidden;
}

.side-menu {
  overflow-y: auto;
}

.settings-container {
  flex-grow: 1;
  margin: 0;
  padding: 16px 8px 0 0;
  overflow-y: scroll;
  overflow-x: auto;
}
</style>

<style lang="less">
@import "../../styles/index";

/*
配信中に設定ダイアログへ表示するメッセージのstyle
子コンポーネントのclassを直接参照しているのでscopedにできない
*/
.notice-section {
  .notice-message {
    color: var(--color-accent);
    font-size: @font-size5;
    font-weight: @font-weight-bold;
    text-align: center;
  }

  .icon-warning {
    margin-right: 4px;
  }
}

.settings-container {
  .input-container {
    flex-direction: column;

    .input-label,
    .input-wrapper {
      width: 100%;
    }

    .input-label {
      label {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
