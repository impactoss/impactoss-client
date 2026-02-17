import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box } from 'grommet';

import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import Icon from 'components/Icon';
import ColumnHeader from 'components/styled/ColumnHeader';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('light', 1)};
  display: table;
  table-layout: fixed;
  margin-bottom: 20px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  @media print {
    margin-bottom: 15px;
  }
`;


const Column = styled(ColumnHeader)`
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-top: 2px;
    padding-bottom: 2px;
  }
`;

const Title = styled.span`
  position: relative;
  top: 2px;
`;

const Via = styled.span`
  font-style: italic;
`;

const SortButton = styled(ButtonFlatIconOnly)`
  color: inherit;
  padding: 0;
  position: relative;
  top: 1px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0;
  }
  @media print {
    display: none !important;
  }
  &:hover, &:focus-visible {
    background-color: ${palette('light', 0)};
  }
`;


class CategoryListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { columns } = this.props;

    return (
      <Styled>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              <Box
                direction="row"
                justify="between"
                align="center"
              >
                <Title>
                  {col.header}
                  {col.via && (
                    <Via>{` ${col.via}`}</Via>
                  )}
                  {col.by && (
                    <span>{col.by}</span>
                  )}
                </Title>
                {col.onClick && (
                  <SortButton
                    onWhite
                    onClick={col.onClick}
                    title={col.sortTitle || 'Sort'}
                  >
                    <Icon name={col.sortIcon} hidePrint={!col.active} />
                  </SortButton>
                )}
              </Box>
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
