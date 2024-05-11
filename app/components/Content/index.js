import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'containers/Footer';
import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';

const Content = React.forwardRef((props, ref) => (
  <ContainerWrapper ref={ref}>
    <Container inModal={props.inModal}>
      {props.children}
    </Container>
    {!props.inModal && (
      <Footer fill hasBorder />
    )}
  </ContainerWrapper>
));

Content.propTypes = {
  children: PropTypes.node,
  inModal: PropTypes.bool,
};

export default Content;
