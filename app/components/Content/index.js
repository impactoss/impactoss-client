import React from 'react';
import PropTypes from 'prop-types';

import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';

class Content extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ContainerWrapper innerRef={this.props.innerRef} >
        <Container inModal={this.props.inModal}>
          {this.props.children}
        </Container>
      </ContainerWrapper>
    );
  }
}

Content.propTypes = {
  children: PropTypes.node,
  inModal: PropTypes.bool,
  innerRef: PropTypes.func,
};

export default Content;
