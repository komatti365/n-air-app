<template>
  <div class="container">
    <div class="header" v-if="!isCompactMode">
      <i
        class="icon-ng icon-btn"
        v-tooltip.bottom="filterTooltip"
        @click="isFilterOpened = true"
      ></i>
      <i
        class="icon-settings icon-btn"
        v-tooltip.bottom="settingsTooltip"
        @click="isSettingsOpened = true"
      ></i>
    </div>
    <div class="content">
      <div class="list" ref="scroll">
        <component
          class="row"
          v-for="item of items"
          :key="item.seqId"
          :is="componentMap[item.component]"
          :chat="item"
          :getFormattedLiveTime="getFormattedLiveTime"
          :commentMenuOpened="commentMenuTarget === item"
          :speaking="speakingSeqId === item.seqId"
          @pinned="pin(item)"
          @commentMenu="showCommentMenu(item)"
        />
        <div class="sentinel" ref="sentinel"></div>
      </div>
      <div class="pinned" v-if="Boolean(pinnedComment)">
        <div class="comment-number">{{ pinnedComment.value.no }}</div>
        <div class="comment-body">
          {{ pinnedItemComtent(pinnedComment) }}
        </div>
        <div class="close"><i class="icon-close icon-btn" @click="pin(null)"></i></div>
      </div>
      <div class="floating-wrapper">
        <button
          type="button"
          @click="scrollToLatest"
          class="scroll-to-latest button--tertiary"
          v-if="!isLatestVisible && items.length > 0"
        >
          <i class="icon-down-arrow"></i>最新のコメントへ移動
        </button>
        <button
          class="button--circle button--tertiary"
          v-tooltip.bottom="commentReloadTooltip"
          @click="refreshConnection"
        >
          <i class="icon-reload"></i>
        </button>
        <button
          class="button--circle button--tertiary"
          v-tooltip.bottom="
            speakingEnabled ? commentSynthesizerOnTooltip : commentSynthesizerOffTooltip
          "
          @click="speakingEnabled = !speakingEnabled"
        >
          <i :class="speakingEnabled ? 'icon-speaker' : 'icon-mute'"></i>
        </button>
      </div>
      <div class="created-notice" v-if="showProgramCreatedNotice">
        <NAirLogo class="created-notice-logo" aria-hidden="true" />
        <div class="created-notice-body">
          <p class="created-notice-large">番組の作成に成功しました！</p>
          <p class="created-notice-small">番組を開始して視聴者に配信を届けましょう</p>
        </div>
      </div>
    </div>
    <comment-form class="comment-form" />
    <comment-filter
      class="overlay"
      @close="isFilterOpened = false"
      v-if="isFilterOpened && !isCompactMode"
    />
    <comment-settings
      class="overlay"
      @close="isSettingsOpened = false"
      v-if="isSettingsOpened && !isCompactMode"
    />
  </div>
</template>

<script lang="ts" src="./CommentViewer.vue.ts"></script>
<style lang="less" scoped>
@import '../../styles/index';

.container {
  width: 100%;
  flex-grow: 1;
  display: flex;
  background-color: var(--color-bg-tertiary);
}

.header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 4px 16px;
  border-bottom: 1px solid var(--color-border-light);

  > .icon-btn {
    margin-left: 16px;

    &:first-child {
      margin-left: auto;
    }
  }
}

.content {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.list {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 0; // 100%がなぜか動かなくなったので workaround (Electron 6.1.11)
  padding-top: 8px;
}

.row {
  font-size: @font-size2;
  height: 32px;
  line-height: 32px;
  width: 100%;
}

.sentinel {
  pointer-events: none;
  height: 4px;
  margin-top: -4px;
}

.pinned {
  font-size: @font-size2;
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  border: 1px solid var(--color-border-light);
  background-color: var(--color-popper-bg-dark);
  border-radius: 4px;
  display: flex;
  padding: 12px 16px;
  z-index: @z-index-default-content;

  & > .comment-number {
    font-weight: @font-weight-bold;
    color: @light-grey;
    flex-shrink: 0;
  }

  & > .comment-body {
    font-weight: @font-weight-bold;
    color: @white;
    margin-left: 16px;
    flex-grow: 1;
    word-break: break-word;
  }

  & > .close {
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-left: 16px;

    & > .icon-btn {
      margin: 0;
      font-size: 10px;
    }
  }
}

.scroll-to-latest {
  .transition;

  display: flex;
  align-items: center;
  font-size: @font-size2;
  color: var(--color-button-label);
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  text-align: center;
  border-radius: 16px;
  cursor: pointer;

  > i {
    font-size: @font-size1;
    margin-right: 8px;
  }
}

.comment-form {
  flex-shrink: 0;
}

.overlay {
  z-index: @z-index-expand-content; // AreaSwitcherのheaderより大きく
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: var(--color-bg-tertiary);
}

.floating-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: @z-index-default-content;
  pointer-events: none;

  button {
    margin: 0 8px;
    pointer-events: auto;
  }
}

.created-notice {
  display: flex;
  align-items: center;
  z-index: @z-index-expand-content; // AreaSwitcherのheaderより大きく
  position: absolute;
  left: 16px;
  bottom: 16px;

  width: calc(100% - 32px);
  .radius;
  .shadow;
  background-color: var(--color-bg-quaternary);
  padding: 8px 12px;
}

.created-notice-logo {
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.created-notice-body {
  display: grid;
  grid-gap: 4px;
  gap: 4px;
}

.created-notice-large {
  color: var(--color-text-light);
  font-size: @font-size2;
  font-weight: @font-weight-bold;
  line-height: 1.5;
  margin: 0;
}

.created-notice-small {
  font-size: @font-size2;
  color: var(--color-text);
  line-height: 1.5;
  margin: 0;
}
</style>
