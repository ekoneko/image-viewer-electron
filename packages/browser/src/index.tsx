import React from 'react'
import { render } from 'react-dom'
import { Provider, Stage, Toolbar, Shortcuts } from '@ekoneko/image-player'
import throttle from 'lodash/throttle'
import { Image } from '@ekoneko/image-player/esm/types/Image'
import { KeyDown } from '@ekoneko/image-player/esm/Shortcuts/KeyDown'
import { NavigateProvider } from '@ekoneko/image-player/esm/stateProviders/NavigateProvider'
import { ImagePlayerData } from 'main/src/plugins/ImagePlayer'
import { Navigator } from './Navigator'

function renderPlayer(imageList: Image[], index = 0) {
  render(
    <Provider imageList={imageList} defaultIndex={index}>
      <Shortcuts>
        <KeyDown shortKey="escape" callback={handleEscape} />
      </Shortcuts>
      <div className="image-preview-wrapper">
        <div className="stage-wrapper">
          <Stage />
        </div>
      </div>
      <NavigateProvider>
        {(index, imageList, handles) => (
          <Navigator index={index} count={imageList.length} {...handles} />
        )}
      </NavigateProvider>
    </Provider>,
    document.getElementById('root'),
  )
}

function handleEscape() {
  window.electronHelper.sendMessage('exit')
}

window.addEventListener('load', async () => {
  const { imageList, index } = await window.electronHelper.sendMessage<ImagePlayerData>(
    'ready',
    void 0,
    {
      needReply: true,
    },
  )
  renderPlayer(
    imageList.map((item) => {
      if (item.startsWith('/')) {
        item = `file://${item}`
      }
      return { src: item }
    }),
    index,
  )

  document.querySelector('#close').addEventListener('click', handleEscape)
})
;(() => {
  let mousemoveFlag = false

  function mouseActive() {
    mousemoveFlag = true
    document.body.classList.add('mouse-move')
  }

  function mouseRest() {
    mousemoveFlag = false
    document.body.classList.remove('mouse-move')
  }

  const throttleMouseRest = throttle(mouseRest, 1000, { leading: false, trailing: true })

  document.addEventListener('mousemove', () => {
    if (!mousemoveFlag) {
      mouseActive()
    }
    throttleMouseRest.cancel()
    throttleMouseRest()
  })
})()
