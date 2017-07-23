import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import Icon from 'components/Icon';
import ColumnHeader from 'components/styled/ColumnHeader';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('light', 1)};
`;

const Column = styled(ColumnHeader)`
  position: relative;
  width:${(props) => props.colWidth}%;
  display: inline-block;
  padding: 0.25em 1em;
  border-right: 1px solid ${palette('light', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;

const Title = styled.div``;

const Via = styled.div`
  font-style: italic;
`;

const SortWrapper = styled.div`
  position: absolute;
  right:0;
  bottom:0;
  text-align:right;
  display: block;
`;
const SortButton = styled(ButtonFlatIconOnly)`
  padding: 0;
  color: inherit;
`;


class CategoryListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { columns } = this.props;

    return (
      <Styled>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              <Title>{col.header}</Title>
              {col.via &&
                <Via>{`(through ${col.via})`}</Via>
              }
              {col.onClick &&
                <SortWrapper>
                  <SortButton onClick={col.onClick}>
                    <Icon name={col.sortIcon} />
                  </SortButton>
                </SortWrapper>
              }
            </Column>
          ))
        }
      </Styled>
    );
  }
}
CategoryListHeader.propTypes = {
  columns: PropTypes.array,
};

export default CategoryListHeader;
