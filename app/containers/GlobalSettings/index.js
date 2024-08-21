/*
 *
 * GlobalSettings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  Box,
  Text,
  CheckBox,
  ResponsiveContext,
} from 'grommet';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { isMinSize } from 'utils/responsive';

import FormBody from 'components/forms/FormBody';
import FormFieldWrap from 'components/forms/FormFieldWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import Field from 'components/fields/Field';
import ButtonDefaultIconOnly from 'components/buttons/ButtonDefaultIconOnly';
import Icon from 'components/Icon';

import appMessages from 'containers/App/messages';
import messages from './messages';

const StyledContainer = styled((p) => <Box {...p} />)`
  padding-bottom: 0px;
`;

const StyledFieldGroupWrapper = styled(FieldGroupWrapper)`
  padding: 15px 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 15px 0;
  }
`;

const StyledForm = styled.form`
  position: relative;
  display: table;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledTitle = styled(Text)`
  text-transform: uppercase;
  color: ${palette('text', 1)};
`;
const TitleWrapper = styled((p) => <Box {...p} />)`
  fill: ${palette('text', 1)};
`;

const StyledLabel = styled(Text)`
  color: ${palette('text', 1)};
`;

const StyledBodyText = styled(Text)`
  color: ${palette('dark', 3)};
`;

const CloseButton = styled((p) => <ButtonDefaultIconOnly {...p} />)``;

const Toggle = styled(CheckBox)`
  width: 1px;
  &:focus-visible {
     + span {
      outline: 2px solid ${palette('buttonDefaultIconOnly', 1)};
      outline-offset: 2px;
    }
  }
  &:not([disabled]) {
    border-color: unset;
  }
  + span {
    background: ${palette('light', 1)};
    border-color: ${palette('light', 3)} !important;
    outline: unset;
    box-shadow: unset;
    &:hover {
      border-color: ${palette('dark', 3)} !important;
    }
    span {
      background: ${({ checked }) => checked ? palette('buttonDefaultIconOnly', 1) : palette('text', 1)} !important;
    }
  }
  `;

const GlobalSettings = ({
  settings,
  onClose,
}) => {
  const size = React.useContext(ResponsiveContext);
  return (
    <Box background="white" pad="large">
      <StyledContainer>
        <Box
          direction="row"
          justify="between"
          margin={{ bottom: 'medium' }}
          align="center"
        >
          <TitleWrapper direction="row" gap="small">
            <Icon name="settings" size="24px" />
            <StyledTitle size="large" weight="bold">
              <FormattedMessage {...appMessages.labels.settings} />
            </StyledTitle>
          </TitleWrapper>
          {onClose && (
            <Box>
              <CloseButton onClick={onClose}>
                <Icon name="close" />
              </CloseButton>
            </Box>
          )}
        </Box>
        <Box gap="small" margin={{ bottom: 'medium' }}>
          <StyledLabel size="large" weight="bold">
            <FormattedMessage {...messages.subHeading} />
          </StyledLabel>
          <StyledLabel size="medium" weight="normal">
            <FormattedMessage {...messages.subHeadingText} />
          </StyledLabel>
        </Box>
        <StyledForm>
          <FormBody>
            <Box>
              <StyledFieldGroupWrapper>
                {Object.keys(settings)
                  .filter((key) => settings[key].available)
                  .map((key) => {
                    const setting = settings[key];
                    return (
                      <Field key={key}>
                        <Box margin={{ bottom: 'medium' }}>
                          <FormFieldWrap>
                            <StyledLabel size="medium" weight="bold">
                              <FormattedMessage {...messages.title[key]} />
                            </StyledLabel>
                          </FormFieldWrap>
                        </Box>
                        <FormFieldWrap>
                          <Box
                            direction={isMinSize(size, 'medium') ? 'row' : 'column'}
                            gap="medium"
                          >
                            <Box basis={isMinSize(size, 'medium') ? '1/2' : '1'}>
                              <Toggle
                                toggle
                                name="radio-ignore-noncurrent"
                                checked={setting.active}
                                label={(
                                  <StyledBodyText weight={500}>
                                    <FormattedMessage {...messages.label[key]} />
                                  </StyledBodyText>
                                )}
                                onChange={setting.onToggle}
                              />
                            </Box>
                            <Box basis={isMinSize(size, 'medium') ? '1/2' : '1'}>
                              {messages.description[key] && (
                                <StyledBodyText weight={300}>
                                  <FormattedMessage {...messages.description[key]} />
                                </StyledBodyText>
                              )}
                            </Box>
                          </Box>
                        </FormFieldWrap>
                      </Field>
                    );
                  })}
              </StyledFieldGroupWrapper>
            </Box>
          </FormBody>
        </StyledForm>
      </StyledContainer>
    </Box>
  );
};

GlobalSettings.propTypes = {
  settings: PropTypes.object,
  onClose: PropTypes.func,
  intl: intlShape,
};

export default injectIntl(GlobalSettings);
