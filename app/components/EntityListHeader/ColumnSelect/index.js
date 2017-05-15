import React, { PropTypes } from 'react';
import styled from 'styled-components';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';
import Column from '../Column';

const Styled = styled(Column)`
  padding: 0.25em 0;
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
    const { isSelected, onSelect, width, label } = this.props;
    return (
      <Styled
        width={width}
      >
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
  width: PropTypes.number,
};
ColumnSelect.defaultProps = {
  label: 'label',
};

export default ColumnSelect;
