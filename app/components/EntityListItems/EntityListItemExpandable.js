import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

const Expandable = styled(Component)`
  display: table-cell;
  background: #fff;
  display: table-cell;
  text-align: center;
  cursor: pointer;
  width: 150px;
  border-left: 2px solid #F1F3F3;
  vertical-align: top;
`;

const Count = styled.div`
  display: inline-block;
  background: #eee;
  color: #333;
  padding: 1px 6px;
  margin: 0 3px;
  border-radius: 999px;
  font-size: 0.8em;
`;

const Info = styled.div``;

export default class EntityListItemExpandable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    // type: PropTypes.string,
    label: PropTypes.string,
    count: PropTypes.number,
    info: PropTypes.array,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    count: 0,
  }

  render() {
    const {
      count,
      onClick,
      info,
      label,
    } = this.props;

    return (
      <Expandable onClick={onClick}>
        <div>{label}</div>
        <Count>{count}</Count>
        { info &&
          info.map((infoLine, i) =>
            (<Info key={i}>{infoLine}</Info>)
          )
        }
      </Expandable>
    );
  }
}
