import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';

import { CONTENT_LIST } from 'containers/App/constants';

import Row from 'components/basic/Row';
import SupTitle from 'components/SupTitle';

import PrimaryAction from 'components/basic/Button/PrimaryAction';
import SimpleAction from 'components/basic/Button/SimpleAction';

const Styled = styled.div`
  padding: 3em 0 1em;
`;

const Title = styled.h1`
  line-height: 1;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class ContentHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
    const { type, icon, supTitle, title, actions } = this.props;
    return (
      <Styled>
        { type === CONTENT_LIST &&
          <SupTitle icon={icon} title={supTitle} />
        }
        { !actions &&
          <Title>{title}</Title>
        }
        { actions &&
          <Row>
            <Grid sm={1 / 2} >
              <Title>{title}</Title>
            </Grid>
            <Grid sm={1 / 2}>
              <ButtonGroup>
                {
                  actions.map((action, i) => (
                    this.renderButton(action, i)
                  ))
                }
              </ButtonGroup>
            </Grid>
          </Row>
        }
      </Styled>
    );
  }
}

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array,
  supTitle: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
};

export default ContentHeader;
