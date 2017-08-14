import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { Form } from 'react-redux-form/immutable';
// import { Form, Errors } from 'react-redux-form/immutable';
import CsvDownloader from 'react-csv-downloader';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';
import { reduce } from 'lodash/collection';

// import asArray from 'utils/as-array';
// import { lowerCase } from 'utils/string';
//
// import appMessages from 'containers/App/messages';

// import Icon from 'components/Icon';
// import FieldFactory from 'components/fields/FieldFactory';
// import Button from 'components/buttons/Button';
// import Label from 'components/fields/Label';
// import FieldWrap from 'components/fields/FieldWrap';
import Field from 'components/fields/Field';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';

import DocumentWrap from 'components/fields/DocumentWrap';

import ButtonCancel from 'components/buttons/ButtonCancel';

import FileSelectControl from '../FileSelectControl';
// import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFieldWrap from '../FormFieldWrap';
// import Required from '../Required';

// import messages from './messages';

const Importing = styled.div`
  color: ${palette('primary', 0)};
  font-weight: bold;
  font-size: 1.2em;
`;
const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('primary', 4)};
  position: relative;
  padding: 1em 0.75em;
`;

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];


export class ImportEntitiesForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getControlProps = (field) => omit(field, nonControlProps);

  computeProgress = ({ sending, success, errors }) =>
    Object.keys(sending).length > 0
      ? ((Object.keys(success).length + Object.keys(errors).length) / Object.keys(sending).length) * 100
      : null;

  render() {
    const { model, handleSubmit, handleCancel, handleReset, fieldModel, template, formData, progressData } = this.props;

    const field = {
      id: 'file',
      label: 'Select file',
      model: `.${fieldModel}`,
      placeholder: 'filename',
    };
    const { id, ...props } = this.getControlProps(field);

    const progress = this.computeProgress(progressData);
    const errors = progressData.errors;

    return (
      <div>
        <FormWrapper>
          <Form model={model} onSubmit={handleSubmit} >
            <FormBody>
              <Field>
                <FormFieldWrap>
                  { (progress === null || progress === 0) &&
                    <FileSelectControl
                      id={id}
                      model={field.model}
                      as="text"
                      accept=".csv, text/csv"
                      {...props}
                    />
                  }
                  { progress > 0 &&
                    <div>
                      <DocumentWrapEdit>
                        { progress < 100 &&
                          <Importing>
                            {`Importing ${formData.get('import').file.name}. `}
                            <Loading
                              progress={progress}
                            />
                          </Importing>
                        }
                        { progress >= 100 &&
                          <div>
                            <p>Complete!</p>
                            <ButtonCancel onClick={handleCancel} type="button">
                              Done
                            </ButtonCancel>
                            <ButtonCancel onClick={handleReset} type="button">
                              Import again
                            </ButtonCancel>
                          </div>
                        }
                      </DocumentWrapEdit>
                      {(Object.keys(errors).length > 0) &&
                        <ErrorMessages
                          error={{
                            messages: reduce(errors, (memo, error) => error.messages
                              ? memo.concat(error.messages)
                              : memo
                            , []),
                          }}
                          onDismiss={this.props.resetProgress}
                        />
                      }
                    </div>
                  }
                </FormFieldWrap>
              </Field>
              <div>
                Not sure about the format?
                <CsvDownloader
                  type="button"
                  text="Download template"
                  datas={template.data}
                  filename={template.filename}
                />
              </div>
            </FormBody>
          </Form>
        </FormWrapper>
      </div>
    );
  }
}

ImportEntitiesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  progressData: PropTypes.object,
  template: PropTypes.object,
};

ImportEntitiesForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default ImportEntitiesForm;
