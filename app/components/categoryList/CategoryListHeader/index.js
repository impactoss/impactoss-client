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
  display: table;
  table-layout: fixed;
`;


const Column = styled(ColumnHeader)`
  width:${(props) => props.colWidth}%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: 30px;
  }
`;

const Title = styled.span``;

const Via = styled.span`
  font-style: italic;
`;


const SortWrapper = styled.div`
  float: right;
  background-color: ${palette('light', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 4px 2px 0 0;
    position: absolute;
    right: 0;
    top: 0;
    float: none;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 6px 2px 0 0;
  }
`;
const SortButton = styled(ButtonFlatIconOnly)`
  color: inherit;
  padding: 0;
`;


class CategoryListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { columns } = this.props;

    return (
      <Styled>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              <Title>
                {col.header}
                {col.via &&
                  <Via>{` ${col.via}`}</Via>
                }
              </Title>
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
