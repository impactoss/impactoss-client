import React, { PropTypes } from 'react';

import Container from 'components/basic/Container';
import ContainerWrapper from 'components/basic/Container/ContainerWrapper';
import PageHeader from 'components/PageHeader';

class Page extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ContainerWrapper>
        <Container>
          <PageHeader title={this.props.title} actions={this.props.actions} />
          {this.props.children}
        </Container>
      </ContainerWrapper>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array,
  children: PropTypes.node,
};

export default Page;
