import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import messages from './messages';

const Styled = styled(Component)`
  display: none;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    display: table-cell;
    text-align: center;
    cursor: pointer;
    width:${(props) => props.width * 100}%;
    border-right: 1px solid ${palette('light', 0)};
    vertical-align: middle;
    padding: 5px 10px;
  }
`;
const IconWrap = styled.span`
  display: inline-block;
  color: ${palette('light', 3)};
  top: -4px;
  position: relative;
`;

const Count = styled.span`
  display: inline-block;
  color: ${palette('text', 1)};
  padding: 0 8px;
  font-size: 1.5em;
`;

const Info = styled.div`
  color: ${(props) => props.palette ? palette(props.palette, 0) : palette('text', 1)};
  font-weight: bold;
`;

class EntityListItemExpandable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      count,
      onClick,
      dates,
      width,
    } = this.props;
    const { type, icon } = this.props.column;

    const info = [];
    if (dates) {
      if (dates.due) {
        info.push({
          label: this.context.intl && this.context.intl.formatMessage(messages.due, { total: dates.due }),
        });
      }
      if (dates.overdue) {
        info.push({
          style: type,
          label: this.context.intl && this.context.intl.formatMessage(messages.overdue, { total: dates.overdue }),
        });
      }
    }
    return (
      <Styled width={width} onClick={onClick}>
        <IconWrap>
          <Icon name={icon} text iconRight />
        </IconWrap>
        <Count type={type} count={count}>{count}</Count>
        { info &&
          info.map((infoItem, i) =>
            (<Info key={i} palette={infoItem.style}>{infoItem.label}</Info>)
          )
        }
      </Styled>
    );
  }
}

EntityListItemExpandable.propTypes = {
  column: PropTypes.object,
  count: PropTypes.number,
  onClick: PropTypes.func,
  width: PropTypes.number,
  dates: PropTypes.object,
};

EntityListItemExpandable.defaultProps = {
  count: 0,
};
EntityListItemExpandable.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemExpandable;
