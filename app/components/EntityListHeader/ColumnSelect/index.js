import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';

const Styled = styled.div`
  flex: ${(props) => props.colWidth ? '0 1 auto' : 1};
  width: ${(props) => props.colWidth || 'auto'};
  padding: 0.25em 0;
  border-right: 1px solid ${palette('greyscaleLight', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;
const CheckboxWrap = styled.div`
  width: 30px;
  padding: 5px;
  display: inline-block;
  text-align: center;
`;
const Checkbox = styled(IndeterminateCheckbox)`
  vertical-align: middle;
`;
const Label = styled.label`
  padding: 5px;
  vertical-align: middle;
`;

class ColumnSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { isSelected, onSelect, label, colWidth } = this.props;
    return (
      <Styled colWidth={colWidth}>
        <CheckboxWrap>
          <Checkbox
            id="select-all"
            checked={isSelected}
            onChange={onSelect}
          />
        </CheckboxWrap>
        <Label htmlFor="select-all">{label}</Label>
      </Styled>
    );
  }
}
ColumnSelect.propTypes = {
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  label: PropTypes.string,
  colWidth: PropTypes.string,
};
ColumnSelect.defaultProps = {
  label: 'label',
};

export default ColumnSelect;
