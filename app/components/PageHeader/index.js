import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';

import Row from 'components/basic/Row';
import H1 from './H1';
import PrimaryAction from './PrimaryAction';
import SimpleAction from './SimpleAction';

const Styled = styled.div`
  padding:40px 0;
`;
const ButtonGroup = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class PageHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderAction = (action, i) => {
    if (action.type === 'simple') {
      return (
        <SimpleAction key={i} onClick={() => action.onClick()}>
          {action.title}
        </SimpleAction>
      );
    }
    if (action.type === 'primary') {
      return (
        <PrimaryAction key={i} onClick={() => action.onClick()}>
          {action.title}
        </PrimaryAction>
      );
    }
    return null;
  }

  render() {
    return (
      <Styled>
        <Row>
          <Grid sm={1 / 2} >
            <H1>{this.props.title}</H1>
          </Grid>
          <Grid sm={1 / 2}>
            <ButtonGroup>
              {
                this.props.actions.map((action, i) => (
                  this.renderAction(action, i)
                ))
              }
            </ButtonGroup>
          </Grid>
        </Row>
      </Styled>
    );
  }
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array,
};

export default PageHeader;
