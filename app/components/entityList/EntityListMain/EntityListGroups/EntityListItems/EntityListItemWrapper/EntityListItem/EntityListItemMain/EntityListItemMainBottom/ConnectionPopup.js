import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';

import { truncateText } from 'utils/string';

const POPUP_WIDTH = 350;
const POPUP_LENGTH = 66;

const Count = styled.span`
  display: inline-block;
  padding: 3px 7px;
  position: relative;
  top: -2px;
  border-radius: 999px;
  font-size: 0.8em;
  background-color: ${(props) => palette(props.pIndex, 0)};
  color: ${palette('primary', 4)};
  height: 1.8em;
  min-width: 1.8em;
  text-align: center;
  vertical-align: middle;
  line-height: 1.8em;
`;

const PopupWrapper = styled.span`
  position: relative;
`;

const Popup = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: ${(props) => {
    if (props.align === 'right') return 'translate(-95%,0)';
    if (props.align === 'left') return 'translate(-5%,0)';
    return 'translate(-50%,0)';
  }};
  width: ${POPUP_WIDTH}px;
  display: block;
  left: 50%;
  z-index: 1;
  padding-bottom: 4px;
`;
const PopupInner = styled.div`
  width: 100%;
  display: block;
  background-color: ${palette('primary', 4)};
  color: ${palette('dark', 1)};
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
`;
const TriangleBottom = styled.div`
   width: 20px;
   height: 11px;
   position: relative;
   overflow: hidden;
   left: ${(props) => {
     if (props.align === 'right') return '95';
     if (props.align === 'left') return '5';
     return '50';
   }}%;
   margin-left: -10px;

   &:after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: ${palette('primary', 4)};
      transform: rotate(45deg);
      bottom: 5px;
      left: 0px;
      box-shadow: -1px -1px 10px -2px rgba(0,0,0,0.5);
   }
`;

const PopupHeader = styled.div`
  padding: 1em;
  font-weight: bold;
  background-color: ${palette('light', 0)};
`;

const PopupContent = styled.div`
  position: relative;
  max-height: 200px;
  height: ${(props) => props.count * 5}em;
  overflow: auto;
`;

const Id = styled.span`
  font-weight: bold;
  color: ${palette('dark', 3)}
`;
const IdSpacer = styled.span`
  padding-left: 0.5em;
  padding-right: 0.5em;
  color: ${palette('dark', 1)};
`;
const ItemContent = styled.span`
  color: ${palette('dark', 1)};
`;

const ListItem = styled.div`
  padding: 1em;
  border-top: 1px solid ${palette('light', 0)};
`;

const ListItemLink = styled(Link)`
  &:hover {
    opacity: 0.75;
  }
`;

export class ConnectionPopup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      popupRef: null,
    };
  }

  getPopupAlign = (wrapper, popupRef) => {
    if (wrapper.getBoundingClientRect().right < (popupRef.getBoundingClientRect().right + (POPUP_WIDTH / 2))) {
      return 'right';
    }
    if (wrapper.getBoundingClientRect().left > (popupRef.getBoundingClientRect().left - (POPUP_WIDTH / 2))) {
      return 'left';
    }
    return 'center';
  }

  openPopup() {
    this.setState({ popupOpen: true });
  }

  closePopup() {
    this.setState({ popupOpen: false });
  }

  render() {
    const { connection, wrapper } = this.props;
    return (
      <PopupWrapper
        onFocus={false}
        onMouseOver={() => this.openPopup()}
        onMouseLeave={() => this.closePopup()}
        innerRef={(node) => {
          if (!this.state.popupRef) {
            this.setState({ popupRef: node });
          }
        }}
      >
        <Count pIndex={connection.option.style}>
          {connection.entities
            ? connection.entities.size
            : 0
          }
        </Count>
        {this.state.popupOpen &&
          <Popup
            align={this.getPopupAlign(wrapper, this.state.popupRef)}
          >
            <PopupInner>
              <PopupHeader>
                {`${connection.entities.size} ${connection.option.label}`}
              </PopupHeader>
              <PopupContent count={connection.entities.size}>
                {
                  connection.entities.toList().map((entity, i) => {
                    const ref = entity.getIn(['attributes', 'reference']) || entity.get('id');
                    return (
                      <ListItem key={i}>
                        <ListItemLink to={`${connection.option.path}/${entity.get('id')}`} >
                          <Id>{ref}</Id>
                          <IdSpacer>|</IdSpacer>
                          <ItemContent>{truncateText(entity.getIn(['attributes', 'title']), POPUP_LENGTH - ref.length)}</ItemContent>
                        </ListItemLink>
                      </ListItem>
                    );
                  })
                }
              </PopupContent>
            </PopupInner>
            <TriangleBottom align={this.getPopupAlign(wrapper, this.state.popupRef)} />
          </Popup>
        }
      </PopupWrapper>
    );
  }
}

ConnectionPopup.propTypes = {
  connection: PropTypes.object,
  wrapper: PropTypes.object,
};

export default ConnectionPopup;
