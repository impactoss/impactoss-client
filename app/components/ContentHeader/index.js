import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';

import { CONTENT_LIST, CONTENT_SINGLE } from 'containers/App/constants';

import Row from 'components/styled/Row';
import SupTitle from 'components/SupTitle';
import Icon from 'components/Icon';

import ButtonFactory from 'components/buttons/ButtonFactory';

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
  color: ${palette('dark', 4)};
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

class ContentHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderTitle = (type, title, icon) => {
    switch (type) {
      case CONTENT_LIST:
        return (<TitleLarge>{title}</TitleLarge>);
      case CONTENT_SINGLE:
        return (
          <TitleIconWrap>
            <Icon name={icon} text textLeft />
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
                      <ButtonFactory button={button} />
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

export default ContentHeader;
