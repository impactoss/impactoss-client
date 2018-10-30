import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';

import { TEXT_TRUNCATE } from 'themes/config';

import { sortEntities } from 'utils/sort';
import { truncateText } from 'utils/string';

import messages from 'components/ItemStatus/messages';
import ItemStatus from 'components/ItemStatus';

const POPUP_WIDTH = 330;

const Count = styled.span`
  display: inline-block;
  position: relative;
  top: 0;
  border-radius: 999px;
  font-size: 0.8em;
  background-color: ${(props) => props.draft ? palette('buttonInverse', 1) : palette(props.pIndex, 0)};
  color: ${(props) => props.draft ? palette(props.pIndex, 0) : palette('buttonDefault', 0)};
  border: 1px solid ${(props) => palette(props.pIndex, 0)};
  height: 1.8em;
  min-width: 1.8em;
  text-align: center;
  vertical-align: middle;
  line-height: 1.7;
  padding: 0 0.5em;
`;

const PopupWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  position: relative;
  margin-right: 10px;
  text-align: left;
  &:last-child {
    margin-right: 0;
  }
`;

const POPUP_WIDTH_PX = `${POPUP_WIDTH}px`;

const Popup = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: ${(props) => {
    if (props.align === 'right') return 'translate(-95%,0)';
    if (props.align === 'left') return 'translate(-5%,0)';
    return 'translate(-50%,0)';
  }};
  width: ${(props) => props.total > 0 ? POPUP_WIDTH_PX : 'auto'};
  min-width: ${(props) => props.total > 0 ? POPUP_WIDTH : POPUP_WIDTH / 2}px;
  display: block;
  z-index: 1;
  padding-bottom: 4px;
  font-size: 0.8em;
`;
const PopupInner = styled.div`
  width: 100%;
  display: block;
  background-color: ${palette('background', 0)};
  color: ${palette('text', 0)};
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.4);
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
      background-color: ${palette('background', 0)};
      transform: rotate(45deg);
      bottom: 5px;
      left: 0px;
      box-shadow: -1px -1px 3px 1px rgba(0,0,0,0.5)
   }
`;

const PopupHeader = styled.div`
  padding: 0.5em 1em;
  background-color: ${palette('background', 1)};
`;
const PopupHeaderMain = styled.span`
  font-weight: bold;
`;

const PopupContent = styled.div`
  position: relative;
  max-height: 200px;
  height: ${(props) => props.height || 200}px;
  overflow: auto;
`;

const Id = styled.span`
  color: ${palette('text', 1)};
  font-size: 0.8em;
`;
const IdSpacer = styled.span`
  padding-left: 0.25em;
  padding-right: 0.25em;
  color: ${palette('text', 1)};
`;
const ItemContent = styled.span``;

const ListItem = styled.div`
  padding: 0.5em 1em;
  border-top: 1px solid ${palette('background', 1)};
`;

const ListItemLink = styled(Link)`
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
`;

export class ConnectionPopup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      popupRef: null,
      listItem_0: 0,
      listItem_1: 0,
      listItem_2: 0,
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

  calcHeight = () => {
    let height = 1;
    if (this.state.listItem_0) height += this.state.listItem_0.clientHeight;
    if (this.state.listItem_1) height += this.state.listItem_1.clientHeight;
    if (this.state.listItem_2) height += this.state.listItem_2.clientHeight;
    return height;
  }

  openPopup() {
    this.setState({ popupOpen: true });
  }

  closePopup() {
    this.setState({ popupOpen: false });
  }

  render() {
    const { entities, option, wrapper, draft } = this.props;

    const entitiesTotal = entities ? entities.size : 0;

    return (
      <PopupWrapper
        onFocus={false}
        onMouseOver={() => this.openPopup()}
        onMouseLeave={() => this.closePopup()}
        onClick={() => this.state.popupOpen ? this.closePopup() : this.openPopup()}
        innerRef={(node) => {
          if (!this.state.popupRef) {
            this.setState({ popupRef: node });
          }
        }}
      >
        <Count pIndex={option.style} draft={draft}>{entitiesTotal}</Count>
        {this.state.popupOpen &&
          <Popup
            align={this.getPopupAlign(wrapper, this.state.popupRef)}
            total={entitiesTotal}
          >
            <PopupInner>
              <PopupHeader>
                <PopupHeaderMain>
                  {`${entitiesTotal} ${option.label(entitiesTotal)}`}
                </PopupHeaderMain>
                { draft &&
                  <PopupHeaderMain>
                    {` (${this.context.intl && this.context.intl.formatMessage(messages.draft)})`}
                  </PopupHeaderMain>
                }
              </PopupHeader>
              <PopupContent height={this.calcHeight()}>
                {
                  sortEntities(entities, 'asc', 'reference')
                  .toList()
                  .map((entity, i) => {
                    const ref = entity.getIn(['attributes', 'reference']) || entity.get('id');
                    return (
                      <ListItem
                        key={i}
                        innerRef={(node) => i < 3 && this.setState({ [`listItem_${i}`]: node })}
                      >
                        <ListItemLink to={`/${option.path}/${entity.get('id')}`} >
                          { entity.getIn(['attributes', 'draft']) &&
                            <ItemStatus draft />
                          }
                          <Id>{ref}</Id>
                          <IdSpacer />
                          <ItemContent>
                            {truncateText(entity.getIn(['attributes', 'title']), TEXT_TRUNCATE.CONNECTION_POPUP - ref.length)}</ItemContent>
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
  entities: PropTypes.object,
  option: PropTypes.object,
  wrapper: PropTypes.object,
  draft: PropTypes.bool,
};
ConnectionPopup.contextTypes = {
  intl: PropTypes.object,
};


export default ConnectionPopup;
