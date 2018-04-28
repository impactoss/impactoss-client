import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'grid-styled';

import Content from 'components/Content';
import Row from 'components/styled/Row';

class ContentNarrow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Content>
        <Row>
          <Grid lg={1 / 3} md={3 / 10} sm={1 / 4} xs={1 / 12} />
          <Grid lg={1 / 3} md={2 / 5} sm={1 / 2} xs={5 / 6}>
            {this.props.children}
          </Grid>
          <Grid lg={1 / 3} md={3 / 10} sm={1 / 4} xs={1 / 12} />
        </Row>
      </Content>
    );
  }
}

ContentNarrow.propTypes = {
  children: PropTypes.node,
};

export default ContentNarrow;
