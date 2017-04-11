import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class TaxonomyListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    taxonomy: PropTypes.object,
  }

  render() {
    const { taxonomy } = this.props;
    return (
      <Link to={taxonomy.linkTo}>
        <h4>{`${taxonomy.count} ${taxonomy.title}`}</h4>
      </Link>
    );
  }
}
