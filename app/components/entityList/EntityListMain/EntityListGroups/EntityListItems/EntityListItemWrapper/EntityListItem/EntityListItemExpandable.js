import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

const Styled = styled(Component)`
  display: table-cell;
  text-align: center;
  cursor: pointer;
  width:${(props) => props.width * 100}%;
  border-right: 1px solid ${palette('light', 0)};
  vertical-align: middle;
  padding: 5px 10px;
`;
const IconWrap = styled.span`
  display: inline-block;
  color: ${palette('light', 3)};
  top: -4px;
  position: relative;
`;

const Count = styled.span`
  display: inline-block;
  color: ${palette('dark', 3)};
  padding: 0 8px;
  font-size: 1.5em;
`;

const Info = styled.div`
  color: ${(props) => palette(props.type, 0)};
  font-weight: bold;
`;

export default class EntityListItemExpandable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    column: PropTypes.object,
    count: PropTypes.number,
    onClick: PropTypes.func,
    width: PropTypes.number,
    dates: PropTypes.object,
  }

  static defaultProps = {
    count: 0,
  }

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
      if (dates.due) info.push(`${dates.due} due`);
      if (dates.overdue) info.push(`${dates.overdue} overdue`);
    }
    return (
      <Styled width={width} onClick={onClick}>
        <IconWrap>
          <Icon name={icon} text iconRight />
        </IconWrap>
        <Count type={type} count={count}>{count}</Count>
        { info &&
          info.map((infoLine, i) =>
            (<Info key={i} type={type}>{infoLine}</Info>)
          )
        }
      </Styled>
    );
  }
}
