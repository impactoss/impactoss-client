import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

const Styled = styled(Component)`
  background: #fff;
  display: table-cell;
  text-align: center;
  cursor: pointer;
  width:${(props) => props.width * 100}%;
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
    width: PropTypes.number,
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
      width,
    } = this.props;

    return (
      <Styled width={width} onClick={onClick}>
        <div>{label}</div>
        <Count>{count}</Count>
        { info &&
          info.map((infoLine, i) =>
            (<Info key={i}>{infoLine}</Info>)
          )
        }
      </Styled>
    );
  }
}
