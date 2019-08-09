import React from 'react'
import { render } from 'react-dom'
import { Provider, Stage, Toolbar, Shortcuts } from '@ekoneko/image-player'
import { Image } from '@ekoneko/image-player/esm/types/Image'

function renderPlayer(imageList: Image[]) {
  render(
    <Provider imageList={imageList}>
      <Shortcuts />
      <div className="image-preview-wrapper">
        <div className="stage-wrapper">
          <Stage />
        </div>
      </div>
    </Provider>,
    document.getElementById('root'),
  )
}

// prevent default browser gestures
document.body.addEventListener(
  'wheel',
  (ev) => {
    if (ev.metaKey || ev.ctrlKey) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  },
  { passive: false },
)

window.addEventListener('load', async () => {
  const imageList = await window.electronHelper.sendMessage<string[]>('ready', void 0, {
    needReply: true,
  })
  renderPlayer(imageList.map((item) => ({ src: item })))
})
