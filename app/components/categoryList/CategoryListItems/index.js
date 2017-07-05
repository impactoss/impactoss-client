import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CategoryListHeader from 'components/categoryList/CategoryListHeader';
import CategoryListItem from 'components/categoryList/CategoryListItem';

const Styled = styled.div``;
const CategoryListBody = styled.div`
  padding-top: 1em
`;

class CategoryListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

CategoryListItems.propTypes = {
  categories: PropTypes.array,
  columns: PropTypes.array,
};

export default CategoryListItems;
