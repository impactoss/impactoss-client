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

const Remove = styled(ButtonFlatIconOnly)`
  display: table-cell;
  padding: 0 0.75em;
  color: ${palette('dark', 2)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;
const ImportButton = styled(ButtonSubmit)`
  display: table-cell;
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('primary', 4)};
  position: relative;
  padding: 0 0 0 0.75em;
  border: 1px solid ${palette('light', 1)};
  font-weight: bold;
  display: table;
`;

const FileName = styled.div`
  display: table-cell;
`;

const Styled = styled.div`
  padding-top: 1em;
  display: block;
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
          <DocumentWrapEdit>
            <FileName>{this.props.value.file.name}</FileName>
            <Remove onClick={this.handleRemove}>
              <Icon name="removeLarge" />
            </Remove>
            <ImportButton type="submit" primary>
              { this.props.value.rows.length === 1 &&
                <FormattedMessage {...messages.import.single} values={{ total: this.props.value.rows.length }} />
              }
              { this.props.value.rows.length !== 1 &&
                <FormattedMessage {...messages.import.plural} values={{ total: this.props.value.rows.length }} />
              }
            </ImportButton>
          </DocumentWrapEdit>
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
