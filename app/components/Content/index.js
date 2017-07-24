import React from 'react';
import PropTypes from 'prop-types';

import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';

class Content extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ContainerWrapper>
        <Container>
          {this.props.children}
        </Container>
      </ContainerWrapper>
    );
  }
}

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
