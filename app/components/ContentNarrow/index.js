import React, { PropTypes } from 'react';

import Grid from 'grid-styled';

import Content from 'components/Content';
import Row from 'components/basic/Row';

class ContentNarrow extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Content>
        <Row>
          <Grid sm={1 / 3} />
          <Grid sm={1 / 3}>
            {this.props.children}
          </Grid>
        </Row>
      </Content>
    );
  }
}

ContentNarrow.propTypes = {
  children: PropTypes.node,
};

export default ContentNarrow;
