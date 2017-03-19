import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    category: PropTypes.object,
  }

  render() {
    const { category } = this.props;
    return (
      <div>
        <h3>
          <Link to={category.linkTo}>
            {`${category.title}`}
          </Link>
        </h3>
      </div>
    );
  }
}
