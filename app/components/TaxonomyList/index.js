import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'grid-styled';

import Component from 'components/styled/Component';
import Row from 'components/styled/Row';
import TaxonomyCard from 'components/TaxonomyCard';

class TaxonomyList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
