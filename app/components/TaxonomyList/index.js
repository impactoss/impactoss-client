import React, { PropTypes } from 'react';
import Grid from 'grid-styled';

import Component from 'components/basic/Component';
import Row from 'components/basic/Row';
import TaxonomyCard from 'components/TaxonomyCard';

class TaxonomyList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { taxonomies } = this.props;

    return (
      <Component>
        <Row>
          {taxonomies.map((taxonomy, i) =>
            <Grid key={i} sm={1 / 4}>
              <TaxonomyCard
                taxonomy={taxonomy}
              />
            </Grid>
          )}
        </Row>
      </Component>
    );
  }
}

TaxonomyList.propTypes = {
  taxonomies: PropTypes.array,
};

export default TaxonomyList;
