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
`;


const Column = styled(ColumnHeader)`
  width:${(props) => props.colWidth}%;
`;

const ColumnInner = styled.div`
  display: table;
  width: 100%;
`;

const Title = styled.span`
  display: table-cell;
`;

const Via = styled.span`
  font-style: italic;
`;

const SortWrapper = styled.div`
  text-align:right;
  display: table-cell;
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
              <ColumnInner>
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
              </ColumnInner>
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
