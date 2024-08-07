/*
 *
 * GlobalSettings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Text, RadioButton } from 'grommet';
import styled from 'styled-components';

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
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import Field from 'components/fields/Field';
import GroupLabel from 'components/fields/GroupLabel';
import FieldLabel from 'components/forms/Label';

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
const StyledGroupLabel = styled(GroupLabel)`
  font-size: 1.2em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const Label = styled((p) => <Text size="small" {...p} />)``;


const GlobalSettings = ({
  loadArchived,
  loadNonCurrent,
  onSetLoadArchived,
  onSetLoadNonCurrent,
}) => {
  console.log('loadArchived', loadArchived);
  console.log('loadNonCurrent', loadNonCurrent);
  console.log('onSetLoadArchived', !!onSetLoadArchived);
  console.log('onSetLoadNonCurrent', !!onSetLoadNonCurrent);
  return (
    <Box
      background="white"
      pad="large"
    >
      <StyledContainer>
        <Box>
          <h2>
            Global settings
          </h2>
        </Box>
        <Box margin={{ bottom: 'medium' }}>
          <Text size="large">
            Configure global settings
          </Text>
        </Box>
        <StyledForm>
          <FormBody>
            <FieldGroupLabel>
              <StyledGroupLabel>
                Configure data
              </StyledGroupLabel>
            </FieldGroupLabel>
            <Box>
              <StyledFieldGroupWrapper>
                {!!onSetLoadArchived && (
                  <Field>
                    <FormFieldWrap>
                      <FieldLabel>
                        Configure content
                      </FieldLabel>
                    </FormFieldWrap>
                    <FormFieldWrap>
                      <Box direction="row" gap="small">
                        <Box basis="1/2">
                          <Box direction="row" gap="medium">
                            <RadioButton
                              name="radio-ignore-archived"
                              checked={!loadArchived}
                              label={<Label>Ignore archived content</Label>}
                              onChange={() => onSetLoadArchived(!loadArchived)}
                            />
                            <RadioButton
                              name="radio-load-archived"
                              checked={loadArchived}
                              label={<Label>Include archived content</Label>}
                              onChange={() => onSetLoadArchived(!loadArchived)}
                            />
                          </Box>
                        </Box>
                        <Box basis="1/2">
                          <Text>Description TODO</Text>
                        </Box>
                      </Box>
                    </FormFieldWrap>
                  </Field>
                )}
                {!!onSetLoadNonCurrent && (
                  <Field>
                    <FormFieldWrap>
                      <FieldLabel>
                        Configure reporting cycles
                      </FieldLabel>
                    </FormFieldWrap>
                    <FormFieldWrap>
                      <Box direction="row" gap="small">
                        <Box basis="1/2">
                          <Box direction="row" gap="medium">
                            <RadioButton
                              name="radio-ignore-noncurrent"
                              checked={!loadNonCurrent}
                              label={<Label>Ignore previous reporting cycles</Label>}
                              onChange={() => onSetLoadNonCurrent(!loadNonCurrent)}
                            />
                            <RadioButton
                              name="radio-load-noncurrent"
                              checked={loadNonCurrent}
                              label={<Label>Include previous reporting cycles</Label>}
                              onChange={() => onSetLoadNonCurrent(!loadNonCurrent)}
                            />
                          </Box>
                        </Box>
                        <Box basis="1/2">
                          <Text>Description TODO</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettings);
