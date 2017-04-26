import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';

import PrimaryAction from 'components/basic/Button/PrimaryAction';
import SimpleAction from 'components/basic/Button/SimpleAction';

import H1 from './H1';

const Styled = styled.div`
  padding:40px 0;
`;
const ButtonGroup = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class PageHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderButton = (action, i) => {
    if (action.type === 'primary') {
      return (
        <PrimaryAction key={i} onClick={() => action.onClick()}>
          {action.title}
        </PrimaryAction>
      );
    }
    return (
      <SimpleAction key={i} onClick={() => action.onClick()}>
        {action.title}
      </SimpleAction>
    );
  }

  render() {
    return (
      <Styled>
        <Grid sm={1 / 2} >
          <H1>{this.props.title}</H1>
        </Grid>
        <Grid sm={1 / 2}>
          { this.props.actions &&
            <ButtonGroup>
              {
                this.props.actions.map((action, i) => (
                  this.renderButton(action, i)
                ))
              }
            </ButtonGroup>
          }
        </Grid>
      </Styled>
    );
  }
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array,
};

export default PageHeader;
