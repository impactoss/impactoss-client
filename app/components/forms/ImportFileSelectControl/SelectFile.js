import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import FileReaderInput from 'react-file-reader-input';
import Baby from 'babyparse';

import Icon from 'components/Icon';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import ButtonDefaultWithIcon from 'components/buttons/ButtonDefaultWithIcon';

import DocumentWrap from 'components/fields/DocumentWrap';
import Messages from 'components/Messages';

import messages from './messages';


const Styled = styled.div`
  padding-top: 1em;
  display: block;
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('background', 0)};
  position: relative;
  padding: 0;
  border: 1px solid ${palette('light', 1)};
  font-weight: 500;
  max-width: 100%;
  padding-right: 35px;
  display: inline-block;
  vertical-align: top;
`;

const FileName = styled.div`
  padding: 1em 0.75em;
  overflow: hidden;
  line-height: normal;
`;

const Remove = styled(ButtonFlatIconOnly)`
  display: block;
  position:absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 0.75em;
  color: ${palette('buttonFlat', 1)};
  &:hover {
    color: ${palette('buttonFlatHover', 1)};
  }
`;

const ImportButton = styled(ButtonSubmit)`
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${palette('buttonDefault', 1)};
`;

class SelectFile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      errors: [],
    };
  }

  componentWillMount() {
    this.setState({ errors: [] });
  }
  onDismissErrors = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ errors: [] });
  }
  handleChange = (e, results) => {
    // todo: limit to 1 file?
    results.forEach((result) => {
      const [evt, file] = result;
      try {
        const parsed = Baby.parse(evt.target.result, { header: true, skipEmptyLines: true });
        if (parsed && parsed.errors && parsed.errors.length > 0) {
          this.setState({ errors: this.state.errors.concat(parsed.errors) });
        } else {
          this.props.onChange({
            rows: parsed.data,
            meta: parsed.meta,
            file,
          });
        }
      } catch (err) {
        this.setState({ errors: this.state.errors.concat([{ error: 0 }]) });
      }
    });
  }

  handleRemove = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onChange(null);
  }

  render() {
    // console.log(this.props.value)
    return (
      <Styled>
        { (this.state.errors.length > 0) &&
          <Messages
            type="error"
            messages={[this.context.intl.formatMessage(messages.fileSelectError)]}
            onDismiss={this.onDismissErrors}
          />
        }
        { this.props.value && (this.state.errors.length === 0) &&
          <div>
            <DocumentWrapEdit>
              <FileName>
                {this.props.value.file.name}
              </FileName>
              <Remove onClick={this.handleRemove}>
                <Icon name="removeLarge" />
              </Remove>
            </DocumentWrapEdit>
            <ImportButton type="submit" primary>
              { this.props.value.rows.length === 1 &&
                <FormattedMessage {...messages.import.single} values={{ total: this.props.value.rows.length }} />
              }
              { this.props.value.rows.length !== 1 &&
                <FormattedMessage {...messages.import.plural} values={{ total: this.props.value.rows.length }} />
              }
            </ImportButton>
          </div>
        }
        { !this.props.value && (this.state.errors.length === 0) &&
          <FileReaderInput
            as={this.props.as}
            accept={this.props.accept}
            onChange={this.handleChange}
          >
            <ButtonDefaultWithIcon type="button" title={this.context.intl.formatMessage(messages.selectFile)} icon="add" />
          </FileReaderInput>
        }
      </Styled>
    );
  }
}

SelectFile.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
  as: PropTypes.string,
  accept: PropTypes.string,
};
SelectFile.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default SelectFile;
