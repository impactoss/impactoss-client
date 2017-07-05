import React from 'react';
import PropTypes from 'prop-types';
import { getRenderedHeight } from 'react-rendered-size';
import styled from 'styled-components';
import { Watch } from 'scrollmonitor-react';

import EntityListItemWrapper from 'components/entityList/EntityListItemWrapper';

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
  componentWillMount() {
    this.setState({ height: getRenderedHeight(this.renderItem()) });
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
};

export default Watch(EntityListItemOuter);
