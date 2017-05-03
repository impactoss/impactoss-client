import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Expandable = styled(Component)`
  background: #fff;
  display: table-cell;
  padding-left: 2px;
  text-align: center;
  cursor: pointer;
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
    type: PropTypes.string,
    count: PropTypes.number,
    info: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    count: 0,
  }

  render () {
    const {
      count,
      onClick,
      info,
    } = this.props;

    return (
      <Expandable onClick={onClick}>
        <Count>{count}</Count>
        { info &&
          <Info>{info}</Info>
        }
      </Expandable>
    )
  }
}
