import type { BytemdPlugin } from 'bytemd'

export default function importMD(): BytemdPlugin {
  return {
    actions: [{
      title: '导入 markdown',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
      <path d="M27.9289 33.0721L18.8579 24.0011L27.9289 14.93M43 24H19M31 41H7L7 7L31 7" stroke-linecap="butt"></path>
      </svg>`,
      position: 'right',
      handler: {
        type: 'action',
        click: async ({ }) => {
          const modal = document.querySelector('.import-modal') as HTMLElement
          modal.style.display = 'block'
          return
        }
      }
    }]
  }
}