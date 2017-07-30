import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { Form } from 'react-redux-form/immutable';
// import { Form, Errors } from 'react-redux-form/immutable';
import CsvDownloader from 'react-csv-downloader';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';
import { map } from 'lodash/collection';

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
  constructor() {
    super();
    this.state = {
      succeeded: {},
      failed: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formData.get('import') === null || this.props.formData.get('import') === null) {
      this.setState({
        succeeded: {},
        failed: {},
      });
    } else {
      if (nextProps.saveSuccess) {
        const timestamp = nextProps.saveSuccess.data.timestamp;
        this.state.succeeded[timestamp] = this.state.succeeded[timestamp] || nextProps.saveSuccess;
      }
      if (nextProps.saveError) {
        const timestamp = nextProps.saveError.data.timestamp;
        this.state.failed[timestamp] = this.state.failed[timestamp] || nextProps.saveError;
      }
    }
  }
  getControlProps = (field) => omit(field, nonControlProps);

  render() {
    const { model, handleSubmit, handleCancel, handleReset, fieldModel, template, formData } = this.props;
    const { failed, succeeded } = this.state;

    const field = {
      id: 'file',
      label: 'Select file',
      model: `.${fieldModel}`,
      placeholder: 'filename',
    };
    const { id, ...props } = this.getControlProps(field);

    const progress = formData.get('import')
      ? ((Object.keys(failed).length + Object.keys(succeeded).length) / formData.get('import').rows.length) * 100
      : null;

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
                            {`Rows processed: ${Object.keys(failed).length + Object.keys(succeeded).length} of ${formData.get('import').rows.length}`}
                            { Object.keys(failed).length > 0 &&
                              <span>
                                {`(${Object.keys(failed).length} errors)`}
                              </span>
                            }
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
                      { Object.keys(failed).length > 0 &&
                        <div>
                          <p>Failed rows:</p>
                          { map(failed, (error, i) => (
                            <p key={i}>
                              {JSON.stringify(error.data.entity.attributes)}
                            </p>
                          ))}
                        </div>
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
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  // saveSuccess: PropTypes.oneOfType([
  //   PropTypes.bool,
  //   PropTypes.object,
  // ]),
  // saveError: PropTypes.oneOfType([
  //   PropTypes.bool,
  //   PropTypes.object,
  // ]),
  template: PropTypes.object,
};

ImportEntitiesForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default ImportEntitiesForm;
