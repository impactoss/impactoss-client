import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';
import Scrollable from 'components/styled/Scrollable';

const Count = styled.span`
  display: inline-block;
  padding: 3px 7px;
  position: relative;
  top: -2px;
  border-radius: 999px;
  font-size: 0.8em;
  background-color: ${(props) => palette(props.pIndex, 0)};
  color: ${palette('primary', 4)};
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
  min-width: 200px;
  max-width: ${POPUP_MAXWIDTH}px;
  display: block;
  background: #fff;
  left: 50%;
  z-index: 1;
  padding: 1em;
  border: 1px solid #ddd;
  color: #000;
`;

const PopupHeader = styled.div`
  font-weight: bold;
  border-bottom: 1px solid;
`;
const PopupFooter = styled.div`
  font-style: italic;
  border-top: 1px solid;
`;
const PopupContent = styled.div`
  position: relative;
  padding: 1em 0;
  height: ${(props) => props.count * 2}em;
  max-height: 200px;
`;

const POPUP_MAXWIDTH = 500;

export class ConnectionPopup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      popupRef: null,
    };
  }

  getPopupAlign = (wrapper, popupRef) => {
    // console.log(wrapper.getBoundingClientRect().right)
    if (wrapper.getBoundingClientRect().right < (popupRef.getBoundingClientRect().right + (POPUP_MAXWIDTH / 2))) {
      return 'right';
    }
    if (wrapper.getBoundingClientRect().left > (popupRef.getBoundingClientRect().left - (POPUP_MAXWIDTH / 2))) {
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
        onMouseOver={this.openPopup}
        onMouseLeave={this.closePopup}
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
            <PopupHeader>
              {`${connection.entities.size} connected ${connection.option.label}`}
            </PopupHeader>
            <PopupContent count={connection.entities.size}>
              <Scrollable>
                {
                  connection.entities.map((entity, i) => (
                    <div key={i}>
                      <Link to={`${connection.option.path}/${entity.get('id')}`} >
                        {entity.getIn(['attributes', 'title'])}
                      </Link>
                    </div>
                  ))
                }
              </Scrollable>
            </PopupContent>
            <PopupFooter>
              Click to view
            </PopupFooter>
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
