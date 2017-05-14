import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';

import { CONTENT_LIST } from 'containers/App/constants';

import Row from 'components/basic/Row';
import SupTitle from 'components/SupTitle';

import ButtonPrimaryIcon from 'components/buttons/ButtonPrimaryIcon';
import ButtonPrimary from 'components/buttons/ButtonPrimary';
import ButtonText from 'components/buttons/ButtonText';

const Styled = styled.div`
  padding: 3em 0 1em;
`;

const Title = styled.h1`
  line-height: 1;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  vertical-align: middle;
  margin-top: 10px;
  height: 2.6em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class ContentHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderButton = (action, i) => {
    switch (action.type) {
      case 'primary' :
        return (
          <ButtonPrimary key={i} onClick={() => action.onClick()}>
            {action.title}
          </ButtonPrimary>
        );
      case 'add' :
        return (
          <ButtonPrimaryIcon
            key={i}
            onClick={() => action.onClick()}
            icon="add"
            title={action.title}
          />
        );
      case 'textPrimary' :
        return (
          <ButtonText key={i} onClick={() => action.onClick()} primary>
            {action.title}
          </ButtonText>
        );
      case 'text' :
      default :
        return (
          <ButtonText key={i} onClick={() => action.onClick()}>
            {action.title}
          </ButtonText>
        );
    }
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
