import React from 'react'
import { NavigateHandlers } from '@ekoneko/image-viewer/esm/stateProviders/NavigateProvider'
import ICON_PREV from '../assets/prev.svg'
import ICON_NEXT from '../assets/next.svg'

export interface NavigatorProps extends NavigateHandlers {
  index: number
  count: number
}
export interface NavigatorState {}
export class Navigator extends React.PureComponent<NavigatorProps, NavigatorState> {
  render() {
    return (
      <div>
        {this.props.index > 0 && (
          <div className="icon-prev">
            <img src={ICON_PREV} onClick={this.props.onNavigatePrev} />
          </div>
        )}
        {this.props.index < this.props.count - 1 && (
          <div className="icon-next">
            <img src={ICON_NEXT} onClick={this.props.onNavigateNext} />
          </div>
        )}
      </div>
    )
  }
}
