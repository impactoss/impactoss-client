import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'containers/Footer';
import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';

const Content = React.forwardRef((props, ref) => (
  <ContainerWrapper
    ref={ref}
    onClick={props.onClickOutside ? (e) => {
      if (e.target === e.currentTarget) {
        props.onClickOutside();
      }
    } : undefined}
  >
    <Container
      inModal={props.inModal}
      role={props.inModal ? null : 'main'}
      id={props.inModal ? null : 'main-content'}
      onClick={props.onClickOutside ? (e) => {
        if (e.target === e.currentTarget) {
          props.onClickOutside();
        }
      } : undefined}
    >
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
  onClickOutside: PropTypes.func,
};

export default Content;
