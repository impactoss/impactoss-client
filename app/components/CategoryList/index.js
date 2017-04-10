import React, { PropTypes } from 'react';

import Container from 'components/basic/Container';
import CategoryListItem from 'components/CategoryListItem';

class CategoryList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { categories } = this.props;

    return (
      <Container>
        {categories.map((cat, i) =>
          <CategoryListItem
            key={i}
            category={cat}
          />
        )}
      </Container>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.array,
};

export default CategoryList;
