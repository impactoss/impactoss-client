import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-redux-form/immutable';

import CsvDownloader from 'react-csv-downloader';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';
import { map } from 'lodash/collection';

import asArray from 'utils/as-array';

import A from 'components/styled/A';
import Field from 'components/fields/Field';

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

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

const Importing = styled.div``;

const ImportingText = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: ${palette('text', 1)};
  margin-bottom: 0.25em;
  margin-top: -0.5em;
  overflow: hidden;
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('background', 0)};
  position: relative;
  padding: 1em 0.75em;
`;

const FormTitle = styled.h2`
  padding-top: 0;
  margin-top: 0;
`;
const Intro = styled.div`
  font-size: 1.2em;
  margin-bottom: 16px;
`;
const Hint = styled.div`
  font-size: 1.2em;
  margin-bottom: 16px;
`;
const CsvDownload = styled.span`
  display: inline-block;
`;
const DownloadTemplate = styled(A)`
  font-weight: bold;
`;
const RowErrors = styled.div`
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

export class ImportEntitiesForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getControlProps = (field) => omit(field, nonControlProps);

  render() {
    const {
      model,
      handleSubmit,
      handleCancel,
      handleReset,
      fieldModel,
      template,
      formData,
      progress,
      errors,
      success,
    } = this.props;

    const field = {
      id: 'file',
      model: `.${fieldModel}`,
      placeholder: 'filename',
    };

    const { id, ...props } = this.getControlProps(field);

    return (
      <FormWrapper white>
        <StyledForm model={model} onSubmit={(data) => data.get('import') !== null && handleSubmit(data)} >
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
                          <CsvDownloader
                            datas={asArray(template.data)}
                            filename={template.filename}
                          >
                            <DownloadTemplate href="/" onClick={(evt) => evt.preventDefault()}>
                              <FormattedMessage {...messages.templateHintDownloadLink} />
                            </DownloadTemplate>
                          </CsvDownloader>
                        </CsvDownload>
                      </li>
                      <li>
                        <FormattedMessage {...messages.formatHint} />
                      </li>
                    </HintList>
                  </Hint>
                  <Field noPadding>
                    <FormFieldWrap>
                      { (progress === null) &&
                        <ImportFileSelectControl
                          id={id}
                          model={field.model}
                          as="text"
                          accept=".csv, text/csv"
                          {...props}
                        />
                      }
                      { progress !== null &&
                        <div>
                          { progress < 100 &&
                            <DocumentWrapEdit>
                              <Importing>
                                <ImportingText>
                                  <FormattedMessage {...messages.importing} />
                                  { formData && `"${formData.get('import').file.name}"`}
                                </ImportingText>
                                <Loading progress={progress} />
                              </Importing>
                            </DocumentWrapEdit>
                          }
                          { progress >= 100 &&
                            <div>
                              {(errors.size > 0 && success.size === 0) &&
                                <Messages
                                  type="error"
                                  message={this.context.intl.formatMessage(messages.allErrors)}
                                />
                              }
                              {(errors.size > 0 && success.size > 0) &&
                                <Messages
                                  type="error"
                                  message={this.context.intl.formatMessage(messages.someErrors, {
                                    successNo: success.size,
                                    rowNo: errors.size + success.size,
                                  })}
                                />
                              }
                              {(errors.size === 0) &&
                                <Messages
                                  type="success"
                                  message={this.context.intl.formatMessage(messages.success, {
                                    rowNo: success.size,
                                  })}
                                />
                              }
                            </div>
                          }
                          {(errors.size > 0) &&
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
                                      : message
                                    ))
                                    : memo
                                  , [])
                                }
                              />
                            </RowErrors>
                          }
                          {(errors.size > 0 && progress >= 100) &&
                            <ErrorHint>
                              <ErrorHintTitle>
                                <FormattedMessage {...messages.errorHintTitle} />
                              </ErrorHintTitle>
                              <ErrorHintText>
                                <FormattedMessage {...messages.errorHintText} />
                              </ErrorHintText>
                            </ErrorHint>
                          }
                        </div>
                      }
                    </FormFieldWrap>
                  </Field>
                </FieldGroupWrapper>
              </Main>
            </ViewPanel>
          </FormBody>
          { progress >= 100 &&
            <FormFooter>
              <FormFooterButtons>
                <ButtonCancel type="button" onClick={handleReset}>
                  <FormattedMessage {...messages.importAgain} />
                </ButtonCancel>
                <ButtonSubmit type="button" onClick={handleCancel}>
                  <FormattedMessage {...messages.done} />
                </ButtonSubmit>
              </FormFooterButtons>
              <Clear />
            </FormFooter>
          }
        </StyledForm>
      </FormWrapper>
    );
  }
}

ImportEntitiesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  progress: PropTypes.number,
  errors: PropTypes.object,
  success: PropTypes.object,
  template: PropTypes.object,
};

ImportEntitiesForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ImportEntitiesForm;
