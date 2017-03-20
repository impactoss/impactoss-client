import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class TaxonomyListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    taxonomy: PropTypes.object,
  }

  render() {
    const { taxonomy } = this.props;
    return (
      <div>
        <h2>
          <Link to={taxonomy.linkTo}>
            {`${taxonomy.count} ${taxonomy.title}`}
          </Link>
        </h2>
      </div>
    );
  }
}
