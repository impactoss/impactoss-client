import React, { PropTypes } from 'react';

export default class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    category: PropTypes.object,
  }

  render() {
    const { category } = this.props;
    return (
      <div>
        <div>
          <button onClick={() => category.onLink()}>
            {`${category.title}`}
          </button>
        </div>
      </div>
    );
  }
}
