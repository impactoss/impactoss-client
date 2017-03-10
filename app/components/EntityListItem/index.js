import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    title: PropTypes.string.isRequired,
    linkTo: PropTypes.string,
    reference: PropTypes.string,
    status: PropTypes.string,
    children: PropTypes.object,
    side: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    children: null,
    side: null,
    className: 'entityListItem',
  }

  render() {
    const title = this.props.linkTo
      ? <h2><Link to={this.props.linkTo}>{this.props.title}</Link></h2>
      : <h2>{this.props.title}</h2>;

    return (
      <div className={this.props.className}>
        <div className="left">
          <input type="checkbox" />
        </div>
        <div className="main">
          <div className="detail">
            {this.props.reference &&
              <span>{this.props.reference}</span>
            }
            {title}
            {this.props.status &&
              <span>{this.props.status}</span>
            }
          </div>
          {this.props.children &&
          <div className="children">
            {this.props.children}
          </div>
          }
        </div>
        {this.props.side &&
          <div className="right">
            {this.props.side}
          </div>
        }
      </div>
    );
  }
}
