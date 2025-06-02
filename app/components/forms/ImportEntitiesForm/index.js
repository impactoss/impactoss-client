import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Formik, Field as FormikField, Form } from 'formik';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  Text,
  Box,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionPanel,
} from 'grommet';

import { omit } from 'lodash/object';
// import { map } from 'lodash/collection';

import asArray from 'utils/as-array';
import { truncateText } from 'utils/string';

import A from 'components/styled/A';
import Field from 'components/fields/Field';
import AccordionHeader from 'components/AccordionHeader';

import ViewPanel from 'components/EntityView/ViewPanel';
import Main from 'components/EntityView/Main';

import Messages from 'components/Messages';
import Loading from 'components/Loading';

import DocumentWrap from 'components/fields/DocumentWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';

import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Clear from 'components/styled/Clear';

import ImportFileSelectControl from '../ImportFileSelectControl';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFieldWrap from '../FormFieldWrap';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';

import messages from './messages';
import CsvDownloadHandler from './CsvDownloadHandler';

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;
const StyledAccordion = styled(Accordion)`
  button {
  box-shadow: unset;
  border-color: unset;
  outline: unset;
  &:focus-visible{
    outline: 2px solid ${palette('primary', 0)};
    outline-offset: 0px;
    }
  }
`;
const Importing = styled.div``;

const ImportingText = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: ${palette('text', 1)};
  margin-bottom: 0.25em;
  margin-top: -0.5em;
  overflow: hidden;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('background', 0)};
  position: relative;
  padding: 1em 0.75em;
`;

const FormTitle = styled.h3`
  padding-top: 0;
  margin-top: 0;
`;

const Intro = styled.div`
  margin-bottom: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 16px;
    font-size: 1.2em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const Hint = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 16px;
    font-size: 1.2em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const CsvDownload = styled.span`
  display: inline-block;
`;

const NoteLink = styled(A)`
  color: #BA5D03;
  &:hover {
    color: #BA5D03;
    text-decoration: underline;
  }
`;
const RowResults = styled.div`
  margin-top: 2em;
`;

const HintList = styled.ul`
  margin: 10px 0;
`;

const HintTitle = styled.h6`
  margin: 0;
  font-weight: normal;
`;

const ErrorHint = styled.div``;
const ErrorHintTitle = styled.h5``;
const ErrorHintText = styled.p``;

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];

export class ImportEntitiesForm extends React.PureComponent {
  getControlProps = (field) => omit(field, nonControlProps);

  render() {
    const {
      handleSubmit,
      handleCancel,
      resetProgress,
      fieldModel,
      template,
      formData,
      progress,
      errors,
      success,
      intl,
    } = this.props;

    const field = {
      id: 'file',
      name: `${fieldModel}`,
      placeholder: 'filename',
    };

    const { id, ...props } = this.getControlProps(field);

    // const rows = formData
    //   && formData.getIn(['import', 'rows']);

    const stats = {
      // totalRows: rows && rows.length,
      // sendingNo: sending && sending.size,
      // sendingByRow: sending && sending.groupBy((item) => item.saveRef).toJS(),
      totalRowsSending: sending && sending.groupBy((item) => item.saveRef).size,
      // successNo: success && success.size,
      // successByRow: success && success.groupBy((item) => item.saveRef).toJS(),
      // totalRowsSuccess: success && success.groupBy((item) => item.saveRef).size,
      // errorsNo: errors && errors.size,
      // errorsByRow: errors && errors.groupBy((item) => item.data && item.data.saveRef).toJS(),
      totalRowsErrors: errors && errors.groupBy((item) => item.data.saveRef).size,
    };
    return (
      <Formik
        initialValues={formData}
        onSubmit={(data) => fieldModel && data[fieldModel] !== null && handleSubmit(data)}
      >
        {({ values, resetForm }) => (
          <FormWrapper white>
            <StyledForm>
              <FormBody>
                <ViewPanel>
                  <Main bottom>
                    <FieldGroupWrapper>
                      <FormTitle>
                        <FormattedMessage {...messages.title} />
                      </FormTitle>
                      <Intro>
                        <FormattedMessage {...messages.introduction} />
                      </Intro>
                      <Hint>
                        <HintTitle>
                          <FormattedMessage {...messages.hintTitle} />
                        </HintTitle>
                        <HintList>
                          <li>
                            <FormattedMessage {...messages.templateHint} />
                            <CsvDownload>
                              <CsvDownloadHandler
                                data={asArray(template.data)}
                                filename={template.filename}
                              >
                                <NoteLink href="/" onClick={(evt) => evt.preventDefault()}>
                                  <FormattedMessage {...messages.templateHintDownloadLink} />
                                </NoteLink>
                              </CsvDownloadHandler>
                            </CsvDownload>
                          </li>
                          <li>
                            <FormattedMessage {...messages.formatHint} />
                          </li>
                        </HintList>
                      </Hint>
                      <Field noPadding>
                        <FormFieldWrap>
                          {(progress === null) && (
                            <FormikField name={field.name}>
                              {({ field: formikField, form }) =>
                                (
                                  <ImportFileSelectControl
                                    id={id}
                                    as="text"
                                    accept=".csv, text/csv"
                                    value={formikField.value}
                                    onChange={(file) => form.setFieldValue(field.name, file)}
                                    {...props}
                                  />
                                )
                              }
                            </FormikField>
                          )}
                          {progress !== null && (
                            <div>
                              {progress < 100 && (
                                <DocumentWrapEdit>
                                  <Importing>
                                    <ImportingText>
                                      <FormattedMessage {...messages.importing} />
                                      {values && `"${values.import.file.name}"`}
                                    </ImportingText>
                                    <Loading progress={progress} />
                                  </Importing>
                                </DocumentWrapEdit>
                              )}
                              {progress >= 100 && (
                                <div>
                                  {(errors.size > 0 && success.size === 0) && (
                                    <Messages
                                      type="error"
                                      message={intl.formatMessage(messages.allErrors)}
                                    />
                                  )}
                                  {(errors.size > 0 && success.size > 0) && (
                                    <Messages
                                      type="error"
                                      message={intl.formatMessage(messages.someErrors, {
                                        successNo: success.size,
                                        rowNo: errors.size + success.size,
                                      })}
                                    />
                                  )}
                                  {(errors.size === 0) && (
                                    <Messages
                                      type="success"
                                      message={intl.formatMessage(messages.success, {
                                        rowNo: success.size,
                                      })}
                                    />
                                  )}
                                </div>
                              )}
                              {(errors.size > 0) && (
                                <RowErrors>
                                  <FormattedMessage {...messages.rowErrorHint} />
                                  <Messages
                                    type="error"
                                    details
                                    preMessage={false}
                                    messages={
                                      errors
                                        .sortBy((error) => error && error.data && error.data.saveRef)
                                        .reduce((memo, error) => error.error.messages
                                          ? memo.concat(map(error.error.messages, (message) => error.data.saveRef
                                            ? [`${error.data.saveRef}:`, message]
                                            : message))
                                          : memo,
                                        [])
                                    }
                                  />
                                </RowErrors>
                              )}
                              {(errors.size > 0 && progress >= 100) && (
                                <ErrorHint>
                                  <ErrorHintTitle>
                                    <FormattedMessage {...messages.errorHintTitle} />
                                  </ErrorHintTitle>
                                  <ErrorHintText>
                                    <FormattedMessage {...messages.errorHintText} />
                                  </ErrorHintText>
                                </ErrorHint>
                              )}
                            </div>
                          )}
                        </FormFieldWrap>
                      </Field>
                    </FieldGroupWrapper>
                  </Main>
                </ViewPanel>
              </FormBody>
              {progress >= 100 && (
                <FormFooter>
                  <FormFooterButtons>
                    <ButtonCancel
                      type="button"
                      onClick={() => {
                        resetForm();
                        resetProgress();
                      }}
                    >
                      <FormattedMessage {...messages.importAgain} />
                    </ButtonCancel>
                    <ButtonSubmit type="button" onClick={handleCancel}>
                      <FormattedMessage {...messages.done} />
                    </ButtonSubmit>
                  </FormFooterButtons>
                  <Clear />
                </FormFooter>
              )}
            </StyledForm>
          </FormWrapper>
        )}
      </Formik>
    );
  }
}

ImportEntitiesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  resetProgress: PropTypes.func,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  progress: PropTypes.number,
  errors: PropTypes.object,
  success: PropTypes.object,
  template: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ImportEntitiesForm);
