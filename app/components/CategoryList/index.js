import React, { PropTypes } from 'react';
import styled from 'styled-components';

import CategoryListHeader from 'components/CategoryListHeader';
import CategoryListItem from 'components/CategoryListItem';

const Styled = styled.div``;
const CategoryListBody = styled.div`
  padding-top: 1em
`;

class CategoryList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { categories, columns } = this.props;

    return (
      <Styled>
        <CategoryListHeader columns={columns} />
        <CategoryListBody>
          {categories.map((cat, i) =>
            <CategoryListItem
              key={i}
              category={cat}
              columns={columns}
            />
          )}
        </CategoryListBody>
      </Styled>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.array,
  columns: PropTypes.array,
};

export default CategoryList;
