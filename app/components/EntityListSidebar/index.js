/*
 *
 * EntityListSidebar
 *
 */
import React, { PropTypes } from 'react';

export default class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.array,
  };

  static defaultProps = {
    children: null,
  };
  renderOptions = () => this.props.options.map((option, key) =>
    (<button key={key} onClick={option.onClick}>{option.label}</button>)
  );

  render() {
    return (
      <div>
        <div>
          {this.renderOptions()}
        </div>
        <div>
          {React.Children.toArray(this.props.children)}
        </div>
      </div>
    );
  }
}
