import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/basic/Component';
import Clear from 'components/basic/Clear';
import Icon from 'components/Icon';

const Styled = styled(Component)`
  display: table-cell;
  text-align: center;
  cursor: pointer;
  width:${(props) => props.width * 100}%;
  border-right: 1px solid ${palette('greyscaleLight', 0)};
  vertical-align: top;
  padding: 5px 10px;
`;
const Top = styled.div`
  float: right;
  color: ${palette('greyscaleLight', 3)};
`;

const Count = styled.div`
  display: inline-block;
  background-color: ${(props) => props.count ? palette(props.type, 0) : palette('greyscaleLight', 4)};
  color: ${palette('primary', 4)};
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 1em;
  margin-bottom: 0.5em;
`;

const Info = styled.div`
  color: ${(props) => palette(props.type, 0)};
  font-weight: bold;
`;

export default class EntityListItemExpandable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    type: PropTypes.string,
    entityIcon: PropTypes.string,
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
      width,
      entityIcon,
      type,
    } = this.props;

    return (
      <Styled width={width} onClick={onClick}>
        <Top>
          <Icon name={entityIcon} text iconRight />
        </Top>
        <Clear />
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
