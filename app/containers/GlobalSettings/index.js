/*
 *
 * GlobalSettings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

import {
  selectLoadArchivedQuery,
  selectLoadNonCurrentQuery,
} from 'containers/App/selectors';

import {
  setLoadArchived,
  setLoadNonCurrent,
} from 'containers/App/actions';

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

const CloseButton = styled((p) => <ButtonDefaultIconOnly {...p} />)`
  position: absolute;
  right:0;
  top:0;
  margin: 3em;
`;

const Toggle = styled(CheckBox)`
  border-radius: 50%;
  + span {
    background: ${palette('light', 1)};
    outline-color: unset;
    span {
      background: ${({ checked }) => checked ? palette('buttonDefaultIconOnly', 1) : palette('text', 1)} !important;
    }
  }
  `;

const GlobalSettings = ({
  loadArchived,
  loadNonCurrent,
  onSetLoadArchived,
  onSetLoadNonCurrent,
  onClose,
}) => {
  const size = React.useContext(ResponsiveContext);
  return (
    <Box background="white" pad="large">
      <StyledContainer>
        <Box>
          <TitleWrapper direction="row" gap="small" margin={{ bottom: 'medium' }}>
            <Icon name="settings" size="24px" />
            <StyledTitle size="large" weight="bold">
              <FormattedMessage {...appMessages.labels.settings} />
            </StyledTitle>
          </TitleWrapper>
          {onClose && (
            <CloseButton onClick={onClose}>
              <Icon name="close" />
            </CloseButton>
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
                {!!onSetLoadNonCurrent && (
                  <Field>
                    <Box margin={{ bottom: 'medium' }}>
                      <FormFieldWrap>
                        <StyledLabel size="medium" weight="bold">
                          <FormattedMessage {...messages.isCurrentTitle} />
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
                            checked={loadNonCurrent}
                            label={(
                              <StyledBodyText weight={500}>
                                <FormattedMessage {...messages.isCurrentHint} />
                              </StyledBodyText>
                            )}
                            onChange={() => onSetLoadNonCurrent(!loadNonCurrent)}
                          />
                        </Box>
                        <Box basis={isMinSize(size, 'medium') ? '1/2' : '1'}>
                          <StyledBodyText weight={300}>
                            <FormattedMessage {...messages.isCurrentDescription} />
                          </StyledBodyText>
                        </Box>
                      </Box>
                    </FormFieldWrap>
                  </Field>
                )}
                {!!onSetLoadArchived && (
                  <Field>
                    <Box margin={{ bottom: 'medium' }}>
                      <FormFieldWrap>
                        <StyledLabel size="medium" weight="bold">
                          <FormattedMessage {...messages.isArchivedTitle} />
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
                            name="radio-ignore-archived"
                            checked={loadArchived}
                            label={(
                              <StyledBodyText weight={500}>
                                <FormattedMessage {...messages.isArchivedHint} />
                              </StyledBodyText>
                            )}
                            onChange={() => onSetLoadArchived(!loadArchived)}
                          />
                        </Box>
                        <Box basis={isMinSize(size, 'medium') ? '1/2' : '1'}>
                          <StyledBodyText weight={300}>
                            <FormattedMessage {...messages.isArchivedDescription} />
                          </StyledBodyText>
                        </Box>
                      </Box>
                    </FormFieldWrap>
                  </Field>
                )}
              </StyledFieldGroupWrapper>
            </Box>
          </FormBody>
        </StyledForm>
      </StyledContainer>
    </Box>
  );
};

GlobalSettings.propTypes = {
  loadArchived: PropTypes.bool,
  loadNonCurrent: PropTypes.bool,
  onSetLoadArchived: PropTypes.func,
  onSetLoadNonCurrent: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape,
};

const mapStateToProps = (state) => ({
  loadArchived: selectLoadArchivedQuery(state),
  loadNonCurrent: selectLoadNonCurrentQuery(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onSetLoadArchived: (value) => dispatch(setLoadArchived(value)),
    onSetLoadNonCurrent: (value) => dispatch(setLoadNonCurrent(value)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GlobalSettings));
