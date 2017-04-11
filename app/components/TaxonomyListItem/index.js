import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ListItem from './ListItem';

export default class TaxonomyListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    taxonomy: PropTypes.object,
  }

  render() {
    const { taxonomy } = this.props;
    return (
      <Link to={taxonomy.linkTo}>
        <ListItem>
          {taxonomy.count}
          <strong> {taxonomy.title}</strong>
        </ListItem>
      </Link>
    );
  }
}
