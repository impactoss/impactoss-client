import React from 'react';
import PropTypes from 'prop-types';
import { getRenderedHeight } from 'react-rendered-size';
import styled from 'styled-components';
import { Watch } from 'scrollmonitor-react';
import { isEqual } from 'lodash/lang';

import EntityListItemWrapper from './EntityListItemWrapper';

const Placeholder = styled.div`
  height: ${(props) => props.height}px;
  width: 100%;
  display: block;
  background-color:#fff;
`;

class EntityListItemOuter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      height: 0,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    // only recalculate height if not in viewport
    // console.log('EntityListItemOuter.shouldComponentUpdate', this.props.entity.id)
    // // console.log('props', isEqual(this.props, nextProps), this.props, nextProps)
    // // console.log('state', isEqual(this.state, nextState), this.state, nextState)
    // console.log('isInViewport', isEqual(this.props.isInViewport, nextProps.isInViewport))
    // console.log('entity', isEqual(this.props.entity, nextProps.entity))
    return this.state.height !== nextState.height
      || this.props.expandNo !== nextProps.expandNo
      || !isEqual(this.props.entity, nextProps.entity)
      || !isEqual(this.props.entityIdsSelected, nextProps.entityIdsSelected)
      || !isEqual(this.props.isInViewport, nextProps.isInViewport);
  }

  componentWillUpdate() {
    // only recalculate height if not in viewport
    if (this.props.scrollContainer && !this.props.isInViewport) {
      // console.log('EntityListItemOuter.componentWillUpdate().getRenderedHeight')
      this.setState({ height: getRenderedHeight(this.renderItem()) });
    }
  }
  renderItem = () => {
    const { entity, ...props } = this.props;
    return (
      <EntityListItemWrapper
        entity={entity}
        {...props}
      />
    );
  }

  render() {
    return (
      <div>
        { !this.props.scrollContainer || this.props.isInViewport
          ? this.renderItem()
          : <Placeholder height={this.state.height} />
        }
      </div>
    );
  }
}

EntityListItemOuter.propTypes = {
  entity: PropTypes.object.isRequired,
  isInViewport: PropTypes.bool,
  scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
  entityIdsSelected: PropTypes.array,
};

export default Watch(EntityListItemOuter);
