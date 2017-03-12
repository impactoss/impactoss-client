import React, { PropTypes } from 'react';

import Container from 'components/basic/Container';
import PageHeader from './PageHeader';

class Page extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        <PageHeader title={this.props.title} actions={this.props.actions} />
        {this.props.children}
      </Container>
    );
  }
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array,
  children: PropTypes.object,
};

export default Page;
