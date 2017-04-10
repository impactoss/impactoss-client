import React, { PropTypes } from 'react';

import Container from 'components/basic/Container';
import TaxonomyListItem from 'components/TaxonomyListItem';

class TaxonomyList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { taxonomies } = this.props;

    return (
      <Container>
        {taxonomies.map((taxonomy, i) =>
          <TaxonomyListItem
            key={i}
            taxonomy={taxonomy}
          />
        )}
      </Container>
    );
  }
}

TaxonomyList.propTypes = {
  taxonomies: PropTypes.array,
};

export default TaxonomyList;
