import React from 'react'
import { render } from 'react-dom'
import { Provider, Stage, Toolbar, Shortcuts } from '@ekoneko/image-player'

const imageList = [
  {
    src: 'http://attach.bbs.miui.com/forum/201209/14/193232tqoez8te5emgmf5q.jpg',
  },
  {
    src: 'http://image.pbs.org/video-assets/iZOsUzY-asset-mezzanine-16x9-8YZsCRv.jpg',
  },
]

render(
  <Provider imageList={imageList}>
    <Shortcuts />
    <div className="image-preview-wrapper">
      <div className="stage-wrapper">
        <Stage />
      </div>
      <div className="toolbar-wrapper">
        <Toolbar />
      </div>
    </div>
  </Provider>,
  document.getElementById('root'),
)

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
