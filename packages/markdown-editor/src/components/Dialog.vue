<template>
  <div class="import-modal byte-modal" ref="modalRef" style="display: none;">
    <div class="byte-modal__mask" style="z-index: 1005;" ></div>
    <div class="byte-modal__wrapper" style="z-index: 1005;" @click="close($event)">
      <div class="byte-modal__content" style="width: 500px;">
        <div class="byte-modal__header"><span class="byte-modal__title">文章导入</span>
          <span aria-label="Close" class="byte-modal__headerbtn" @click="close">
            <i class="byte-icon byte-icon--close">
              <svg t="1561638608887" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="441911" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="M512 448l288-288c6.4-6.4 19.2-6.4 32 0l25.6 32c6.4 6.4 6.4 19.2 0 32L569.6 505.6l288 288c6.4 6.4 6.4 19.2 0 32l-32 32c-6.4 6.4-19.2 6.4-32 0L512 569.6l-288 288c-6.4 6.4-19.2 6.4-32 0l-32-32c-6.4-6.4-6.4-19.2 0-32L448 505.6 160 224c-6.4-12.8-6.4-25.6 0-32l32-32c6.4-6.4 19.2-6.4 32 0L512 448z"
                  p-id="441912"></path>
                <path
                  d="M512 448l288-288c6.4-6.4 19.2-6.4 32 0l25.6 32c6.4 6.4 6.4 19.2 0 32L569.6 505.6l288 288c6.4 6.4 6.4 19.2 0 32l-32 32c-6.4 6.4-19.2 6.4-32 0L512 569.6l-288 288c-6.4 6.4-19.2 6.4-32 0l-32-32c-6.4-6.4-6.4-19.2 0-32L448 505.6 160 224c-6.4-12.8-6.4-25.6 0-32l32-32c6.4-6.4 19.2-6.4 32 0L512 448z"
                  p-id="441913"></path>
              </svg>
            </i>
          </span>
        </div>
        <div class="byte-modal__body" @click="selectMD($event)" @drop.prevent="onDrop" @dragover.prevent="onDragover"
          @dragleave.prevent="dragover = false">
          <div class="upload-area"><svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"
              class="upload-icon">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M28.326 9.999c.92 0 1.667.746 1.667 1.666v.008l-.111 25.178c0 .818-.743 1.481-1.66 1.481H4.986c-.917 0-1.66-.663-1.66-1.481l.119-25.37c0-.819.743-1.482 1.66-1.482h23.221zm-1.66 3.333h-20v21.667h20V13.332zm-9.352 3.577l5.893 5.893a.833.833 0 010 1.178L22.03 25.16a.833.833 0 01-1.179 0l-2.447-2.448v8.61c0 .46-.373.832-.833.832h-1.667a.833.833 0 01-.834-.833V22.69l-2.469 2.47a.833.833 0 01-1.178 0l-1.179-1.178a.833.833 0 010-1.179l5.893-5.893a.833.833 0 011.178 0zM35 3.332c.92 0 1.667.746 1.667 1.667v20.833c0 .46-.373.833-.833.833h-1.667a.833.833 0 01-.833-.833V6.665H17.499a.833.833 0 01-.833-.833V4.165c0-.46.373-.833.833-.833H35z"
                fill="#1E80FF"></path>
            </svg>
            <div class="placeholder"> 拖拽MD文件到这里，或点击进行上传 </div>
            <div class="placeholder-mini"> 仅支持导入 MD 格式的文档，最大 10 MB，每次仅可上传 1 篇 <br>
              请在上传前检查文档图片路径，本地路径的图片会上传失败 </div>
            <button type="button" class="byte-btn byte-btn--primary">
              <span> 上传文档 </span>
            </button>
            <input type="file" accept=".md" style="display: none;" ref="fileInputRef">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const modalRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const dragover = ref(false)

const emits = defineEmits(["fileChange"])

onMounted(() => {
  fileInputRef.value?.addEventListener('change', () => {
    const files = fileInputRef.value?.files

    if (files && files.length > 0) {
      emits('fileChange', files[0])
      close()
    }
  })
})

function selectMD(e: Event) {
  e.stopPropagation()
  fileInputRef.value?.click()
}

function close(e?: Event) {
  e?.stopPropagation()
  modalRef.value!.style.display = 'none'
}

const onDrop = (e: DragEvent) => {
  dragover.value = false

  e.stopPropagation()

  const files = Array.from(e.dataTransfer!.files)

  if (files && files.length > 0) {
    emits('fileChange', files[0])
    close()
  }
}

const onDragover = () => {
  dragover.value = true
}
</script>

<style scoped lang="scss">
.byte-modal__mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
}

.byte-modal__wrapper {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: 0;
}

.byte-modal__content {
  position: relative;
  margin: 0 auto 50px;
  padding: 28px;
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 2px 8px 0 rgb(0 0 0/15%);
  box-shadow: 0 2px 8px 0 rgb(0 0 0/15%);
  top: 100px;
  color: #282f38
}

.byte-modal__header {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  padding: 0 30px 12px 30px;
  border-bottom: 1px solid #e5e6eb;
}

.byte-modal__body {
  padding: 16px 20px;
}

.byte-modal__headerbtn {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  position: absolute;
  top: 0;
  right: 0;
  color: #939aa3;
  border: none;
  outline: none;
  cursor: pointer;
}


.byte-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.byte-btn {
  padding: 7px 40px;
  border-radius: 4px;
  height: 36px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(30, 128, 255);
  outline: 0;
  border: 1px solid #e6e8eb;
  white-space: nowrap;
  cursor: pointer;
}

.byte-btn--primary {
  color: #fff;
  background-color: #3370ff;
  border-color: #3370ff;
}

.upload-area {
  background: rgb(247, 248, 250);
  border: 1px dashed rgb(228, 230, 235);
  border-radius: 4px;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  padding: 28px 0px;
  cursor: pointer;

  .upload-icon {
    width: 40px;
    height: 40px;
  }

  .placeholder {
    font-size: 16px;
    line-height: 24px;
    color: rgb(81, 87, 103);
    margin-top: 16px;
  }

  .placeholder-mini {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: rgb(138, 145, 159);
    margin-top: 8px;
    margin-bottom: 24px;
  }
}

.import-modal .byte-modal__content {
  width: 500px;
  padding: 0px;
  margin: 0px auto;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 4px;
}

.import-modal .byte-modal__header {
  padding: 16px 20px;
  border-bottom: 0.5px solid rgb(229, 230, 235);
}

.import-modal .byte-modal__body {
  padding: 16px 20px;
}
</style>