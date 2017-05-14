import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';


const Styled = styled(Button)`
  width:${(props) => props.width * 100}%;
  display: inline-block;
  padding: 0.25em 1em;
  border-right: 1px solid ${palette('greyscaleLight', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
  text-align: left;
`;

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const IconWrap = styled.div`
  float:right;
`;

class ColumnExpand extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { isExpand, label, width, onExpand } = this.props;
    return (
      <Styled
        onClick={onExpand}
        width={width}
      >
        <Label>{label}</Label>
        <IconWrap>
          {isExpand &&
            <Icon name="columnCollapse" text textRight />
          }
          {!isExpand &&
            <Icon name="columnExpand" text textRight />
          }
        </IconWrap>
      </Styled>
    );
  }
}
ColumnExpand.propTypes = {
  isExpand: PropTypes.bool,
  onExpand: PropTypes.func,
  label: PropTypes.string,
  width: PropTypes.number,
};
ColumnExpand.defaultProps = {
  label: 'label',
};

export default ColumnExpand;
