import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Control, Form, Errors } from 'react-redux-form/immutable';
import CsvDownloader from 'react-csv-downloader';

import { omit } from 'lodash/object';

// import asArray from 'utils/as-array';
// import { lowerCase } from 'utils/string';
//
import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import FieldFactory from 'components/fields/FieldFactory';
import Button from 'components/buttons/Button';
import Label from 'components/fields/Label';
import FieldWrap from 'components/fields/FieldWrap';
import Field from 'components/fields/Field';
import {
  validateRequired,
} from 'utils/forms';

import FileSelectControl from '../FileSelectControl';
import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormPanel from '../FormPanel';
import FormFooter from '../FormFooter';
import FormFieldWrap from '../FormFieldWrap';
import ButtonCancel from '../ButtonCancel';
import ButtonSubmit from '../ButtonSubmit';
import Required from '../Required';

// import messages from './messages';

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];


export class ImportEntitiesForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getControlProps = (field) => {
    return omit(field, nonControlProps);
  }

  render() {
    const { model, handleSubmit, handleCancel, fieldModel, template } = this.props;
    const field = {
      id: 'file',
      label: 'Select file',
      model: `.${fieldModel}`,
      placeholder: 'filename',
    };

    const { id, ...props } = this.getControlProps(field);
    return (
      <div>
        <FormWrapper>
          <Form model={model} onSubmit={handleSubmit} >
            <FormPanel>
              <Field>
                <FormFieldWrap>
                  <FileSelectControl
                    id={id}
                    model={field.model}
                    as="text"
                    accept=".csv, text/csv"
                    {...props}
                  />
                </FormFieldWrap>
              </Field>
            </FormPanel>
            <FormFooter>
              <ButtonCancel onClick={handleCancel}>
                <FormattedMessage {...appMessages.buttons.cancel} />
              </ButtonCancel>
              <ButtonSubmit type="submit">
                Import
              </ButtonSubmit>
            </FormFooter>
          </Form>
        </FormWrapper>
        <div>
          Not sure about the format?
          <CsvDownloader
          text="Download template"
          datas={template.data}
          filename={template.filename}
          />
        </div>
      </div>
    );
  }
}

ImportEntitiesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
  fieldModel: PropTypes.string,
  formData: PropTypes.object,
  template: PropTypes.object,
};

ImportEntitiesForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default ImportEntitiesForm;
