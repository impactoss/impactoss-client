import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';

import { CONTENT_LIST, CONTENT_SINGLE } from 'containers/App/constants';

import Row from 'components/basic/Row';
import SupTitle from 'components/SupTitle';
import Icon from 'components/Icon';

import ButtonPrimaryIcon from 'components/buttons/ButtonPrimaryIcon';
import ButtonPrimary from 'components/buttons/ButtonPrimary';
import ButtonText from 'components/buttons/ButtonText';
import ButtonIcon from 'components/buttons/ButtonIcon';

import appMessages from 'containers/App/messages';


const Styled = styled.div`
  padding: 3em 0 1em;
`;

const TitleLarge = styled.h1`
  line-height: 1;
  margin-top: 10px;
`;
const TitleMedium = styled.h3`
  line-height: 1;
  margin-top: 0;
  display: inline-block;
`;
const TitleSmall = styled.h4`
  line-height: 1;
  margin-top: 0;
  display: inline-block;
`;
const TitleIconWrap = styled.span`
  color: ${palette('greyscaleDark', 4)};
`;
const ButtonWrap = styled.span`
  padding: 0 0.5em;
`;

const ButtonGroup = styled.div`
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class ContentHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderButton = (action) => {
    switch (action.type) {
      case 'primary' :
        return (
          <ButtonPrimary onClick={() => action.onClick()}>
            {action.title}
          </ButtonPrimary>
        );
      case 'add' :
        return (
          <ButtonPrimaryIcon
            onClick={() => action.onClick()}
            icon="add"
            title={action.title || this.context.intl.formatMessage(appMessages.buttons.add)}
          />
        );
      case 'edit' :
        return (
          <ButtonPrimaryIcon
            onClick={() => action.onClick()}
            icon="edit"
            title={action.title || this.context.intl.formatMessage(appMessages.buttons.edit)}
          />
        );
      case 'close' :
        return (
          <ButtonIcon
            onClick={() => action.onClick()}
            title={action.title || this.context.intl.formatMessage(appMessages.buttons.close)}
          >
            <Icon name="close" />
          </ButtonIcon>
        );
      case 'textPrimary' :
        return (
          <ButtonText onClick={() => action.onClick()} primary>
            {action.title}
          </ButtonText>
        );
      case 'text' :
      default :
        return (
          <ButtonText onClick={() => action.onClick()}>
            {action.title}
          </ButtonText>
        );
    }
  }
  renderTitle = (type, title, icon) => {
    switch (type) {
      case CONTENT_LIST:
        return (<TitleLarge>{title}</TitleLarge>);
      case CONTENT_SINGLE:
        return (
          <TitleIconWrap>
            <Icon name={icon} text textLeft size="3em" />
            <TitleSmall>{title}</TitleSmall>
          </TitleIconWrap>
        );
      default:
        return (<TitleMedium>{title}</TitleMedium>);
    }
  }
  render() {
    const { type, icon, supTitle, title, buttons } = this.props;
    return (
      <Styled>
        { type === CONTENT_LIST &&
          <SupTitle icon={icon} title={supTitle} />
        }
        <Row>
          <Grid sm={buttons ? 1 / 2 : 1}>
            {this.renderTitle(type, title, icon)}
          </Grid>
          { buttons &&
            <Grid sm={1 / 2}>
              <ButtonGroup>
                {
                  buttons.map((button, i) => (
                    <ButtonWrap key={i}>
                      { this.renderButton(button, i) }
                    </ButtonWrap>
                  ))
                }
              </ButtonGroup>
            </Grid>
          }
        </Row>
      </Styled>
    );
  }
}

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.array,
  supTitle: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
};
ContentHeader.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default ContentHeader;
