import type { BytemdPlugin } from 'bytemd'

export default function exportMD(): BytemdPlugin {
  return {
    actions: [{
      title: '导出 markdown',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
      <path d="M31.9285 33.0721L40.9996 24.0011L31.9285 14.93M16.8574 24L40.8574 24M31 41H7L7 7L31 7" stroke-linecap="butt"></path>
      </svg>`,
      position: 'right',
      handler: {
        type: 'action',
        click: ({ editor }) => {
          const title = window.localStorage.getItem('title') || '无标题'
          const data = editor.getValue()

          const blob = new Blob([data], { type: 'text/markdown;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${title}.md`
          link.click()
          return
        }
      }
    }]
  }
}