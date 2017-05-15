import React, { PropTypes } from 'react';

import Container from 'components/basic/Container';
import ContainerWrapper from 'components/basic/Container/ContainerWrapper';

class Content extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
