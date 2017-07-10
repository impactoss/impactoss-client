import React from 'react';
import PropTypes from 'prop-types';
import { getRenderedHeight } from 'react-rendered-size';
import { Watch } from 'scrollmonitor-react';
import styled from 'styled-components';
// import { isEqual } from 'lodash/lang';
import { List, Map } from 'immutable';

import EntityListItemWrapper from './EntityListItemWrapper';

const Placeholder = styled.div`
  height: ${(props) => props.height}px;
  width: 100%;
  display: block;
`;

class EntityListItemOuter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      height: 0,
    };
  }
  componentWillMount() {
    // console.log('EntityListItemOuter.componentWillMount()',
    //   this.props.entity.id,
    //   this.props.isInViewport,
    // )
    if (this.props.scrollContainer && !this.props.isInViewport) {
      // console.log('componentWillMount setheight', this.props.entity.id)
      this.setState({ height: getRenderedHeight(this.renderItem()) });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // only recalculate height if not in viewport
    // console.log('EntityListItemOuter.shouldComponentUpdate', this.props.entity.get('id'))
    // console.log('height', this.state.height === nextState.height, this.state.height, nextState.height)
    // console.log('isInViewport', isEqual(this.props.isInViewport, nextProps.isInViewport))
    // console.log('expandNo', this.props.expandNo === nextProps.expandNo, nextProps.expandNo)
    // console.log('entity', isEqual(this.props.entity, nextProps.entity))
    // console.log('entityIdsSelected', isEqual(this.props.entityIdsSelected, nextProps.entityIdsSelected))

    return this.props.entity !== nextProps.entity
    || this.props.expandNo !== nextProps.expandNo
    || this.props.isInViewport !== nextProps.isInViewport
    || (nextProps.isInViewport && (this.props.entityIdsSelected !== nextProps.entityIdsSelected))
    || (!nextProps.isInViewport && (this.state.height !== nextState.height));
  }
  componentWillUpdate(nextProps) {
    // // only recalculate height if not in viewport
    // console.log('EntityListItemOuter.componentWillUpdate()',
    //   this.props.entity.id,
    //   this.props.isInViewport,
    //   nextProps.isInViewport,
    // )
    if (this.props.scrollContainer && !nextProps.isInViewport) {
      // console.log('componentWillUpdate setheight', this.props.entity.get('id'))
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
    // console.log(
    //   'EntityListItemOuter.render',
    //   this.props.entity.id,
    //   this.props.isInViewport,
    // )

    return (
      <div>
        { this.props.scrollContainer && this.props.isInViewport &&
          this.renderItem()
        }
        { this.props.scrollContainer && !this.props.isInViewport &&
          <Placeholder height={this.state.height} />
        }
      </div>
    );
  }
}

EntityListItemOuter.propTypes = {
  entityIdsSelected: PropTypes.instanceOf(List),
  entity: PropTypes.instanceOf(Map).isRequired,
  isInViewport: PropTypes.bool,
  scrollContainer: PropTypes.object,
  expandNo: PropTypes.number,
};

export default Watch(EntityListItemOuter);
