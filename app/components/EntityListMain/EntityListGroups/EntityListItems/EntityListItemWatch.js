import React from 'react';
import PropTypes from 'prop-types';
import { getRenderedHeight } from 'react-rendered-size';
import { Watch } from 'scrollmonitor-react';
import styled from 'styled-components';
// import { isEqual } from 'lodash/lang';
import { List, Map } from 'immutable';

const Placeholder = styled.div`
  height: ${(props) => props.height}px;
  width: 100%;
  display: block;
`;

class EntityListItemWatch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { height: 0 };
  }
  componentWillMount() {
    this.setState({ height: getRenderedHeight(this.props.renderEntity(true)) });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isInViewport !== nextProps.isInViewport
    || this.props.expandNo !== nextProps.expandNo
    || this.props.entity !== nextProps.entity
    || this.props.errors !== nextProps.errors
    || (nextProps.isInViewport && (this.props.entityIdsSelected !== nextProps.entityIdsSelected))
    || (!nextProps.isInViewport && (this.state.height !== nextState.height));
  }
  componentWillUpdate(nextProps) {
    // only recalculate height if not in viewport and only if things changed
    if (!nextProps.isInViewport && (this.props.expandNo !== nextProps.expandNo || this.props.entity !== nextProps.entity)) {
      this.setState({ height: getRenderedHeight(this.props.renderEntity(true)) });
    }
  }

  render() {
    return (
      <div>
        { this.props.isInViewport && this.props.renderEntity() }
        { !this.props.isInViewport &&
          <Placeholder height={this.state.height} />
        }
      </div>
    );
  }
}

EntityListItemWatch.propTypes = {
  entityIdsSelected: PropTypes.instanceOf(List),
  entity: PropTypes.instanceOf(Map).isRequired,
  errors: PropTypes.instanceOf(Map),
  isInViewport: PropTypes.bool,
  // scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
  renderEntity: PropTypes.func,
};

export default Watch(EntityListItemWatch);
