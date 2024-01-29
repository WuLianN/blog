import type { BytemdPlugin } from 'bytemd'
import themesMap from 'juejin-markdown-themes'

function removeOldStyle() {
  const styleList = document.querySelectorAll('style')
  const index = [...styleList].findIndex(item => item.getAttribute('data-themes'))
  index !== -1 && styleList[index].remove()
}

function setStyle(style: string) {
  removeOldStyle()
  const $style = document.createElement('style');
  $style.setAttribute('data-themes', "1")
  $style.innerHTML = style
  document.head.appendChild($style);
}

export default function themes(): BytemdPlugin {
  const actionItems: { title: string; style: string }[] = []
  for (const key in themesMap) {
    actionItems.push({
      title: key,
      style: themesMap[key].style
    })
  }

  const info = {
    data: '',
    status: 0,
    position: {
      start: {
        line: 0,
        column: 0,
        offset: 0
      },
      end: {
        line: 0,
        column: 0,
        offset: 0
      }
    }
  }

  return {
    viewerEffect({ file }) {
      // @ts-ignore
      const style = themesMap[file.frontmatter?.theme]?.style ?? themesMap.juejin.style;
      setStyle(style)
    },
    remark: (processor) =>
      // @ts-ignore
      processor.use(() => (tree, file) => {
        // no frontmatter block, return directly and use default theme
        if (!file.frontmatter) {
          info.status = 0
          // reset position
          info.position = {
            start: {
              line: 0,
              column: 0,
              offset: 0
            },
            end: {
              line: 0,
              column: 0,
              offset: 0
            }
          }
          return
        }

        // get position of frontmatter block and save it to global variable
        const { start, end } = tree.children[0].position
        info.position = { start, end }

        const { theme } = file.frontmatter as {
          theme?: string
        }

        // no theme field, use default theme
        if (!theme) {
          info.status = 1
          return
        }

        // use theme field if it exists
        if (actionItems.find(item => item.title === theme)) {
          info.data = theme
          info.status = 2
          return
        }

        // theme field is invalid
        throw new Error(`Invalid markdown theme: ${theme}, please check your options.`)
      }),
    actions: [
      {
        title: 'markdown 主题',
        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2H2.66667C2.29848 2 2 2.29848 2 2.66667V6C2 6.36819 2.29848 6.66667 2.66667 6.66667H6C6.36819 6.66667 6.66667 6.36819 6.66667 6V2.66667C6.66667 2.29848 6.36819 2 6 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path>
      <path d="M6 9.3335H2.66667C2.29848 9.3335 2 9.63197 2 10.0002V13.3335C2 13.7017 2.29848 14.0002 2.66667 14.0002H6C6.36819 14.0002 6.66667 13.7017 6.66667 13.3335V10.0002C6.66667 9.63197 6.36819 9.3335 6 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path>
      <path d="M13.3334 2H10C9.63185 2 9.33337 2.29848 9.33337 2.66667V6C9.33337 6.36819 9.63185 6.66667 10 6.66667H13.3334C13.7016 6.66667 14 6.36819 14 6V2.66667C14 2.29848 13.7016 2 13.3334 2Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path>
      <path d="M13.3334 9.3335H10C9.63185 9.3335 9.33337 9.63197 9.33337 10.0002V13.3335C9.33337 13.7017 9.63185 14.0002 10 14.0002H13.3334C13.7016 14.0002 14 13.7017 14 13.3335V10.0002C14 9.63197 13.7016 9.3335 13.3334 9.3335Z" stroke="#1D2129" stroke-width="1.33" stroke-linejoin="round"></path>
      </svg>`, // 16x16 SVG icon
        handler: {
          type: 'dropdown',
          actions: actionItems.map(({ title, style }) => ({
            title,
            handler: {
              type: 'action',
              click({ editor }) {
                setStyle(style)

                const v = editor.getValue()
                const { start, end } = info.position
                const frontmatter = v.slice(start.offset, end.offset)

                const newFrontmatter =
                  info.status === 0
                    ? `---\ntheme: ${title}\n---\n`
                    : info.status === 1
                      ? frontmatter.replace('---', `---\ntheme: ${title}`)
                      : frontmatter.replace(info.data, title)

                editor.setValue(v.replace(frontmatter, newFrontmatter))

                editor.focus()
              },
            },
          })),
        },
      },
    ],
  }
}