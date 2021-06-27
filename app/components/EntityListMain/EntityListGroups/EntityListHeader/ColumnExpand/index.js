import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/Icon';
import ColumnHeader from 'components/styled/ColumnHeader';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import PrintHide from 'components/styled/PrintHide';


const Styled = styled(ColumnHeader)`
  display: none;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    display: table-cell;
    text-align: left;
    padding-right: 0.5em;
    padding-left: 1em;
  }
  @media print {
    display: table-cell;
  }
`;

const Wrapper = styled.div`
  display: table;
  width: 100%;
  @media print {
    display: block;
  }
`;
const Label = styled.div`
  display: table-cell;
  vertical-align: middle;
  @media print {
    display: block;
  }
`;

const ExpandWrapper = styled(PrintHide)`
  display: table-cell;
  text-align:right;
`;

const ExpandButton = styled(ButtonFlatIconOnly)`
  padding: 0;
  color: inherit;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0;
  }
`;
class ColumnExpand extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      isExpand, label, width, onExpand,
    } = this.props;
    return (
      <Styled colWidth={width * 100}>
        <Wrapper>
          <Label>{label}</Label>
          <ExpandWrapper>
            <ExpandButton
              onClick={onExpand}
            >
              {isExpand
                && <Icon name="columnCollapse" />
              }
              {!isExpand
                && <Icon name="columnExpand" />
              }
            </ExpandButton>
          </ExpandWrapper>
        </Wrapper>
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
