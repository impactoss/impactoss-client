import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import FileReaderInput from 'react-file-reader-input';
import Baby from 'babyparse';

// import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import ButtonDefaultWithIcon from 'components/buttons/ButtonDefaultWithIcon';

import DocumentWrap from 'components/fields/DocumentWrap';

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

  handleChange = (e, results) => {
    // todo: limit to 1 file?
    results.forEach((result) => {
      const [evt, file] = result;
      // try {
      const parsed = Baby.parse(evt.target.result, { header: true, skipEmptyLines: true });
      if (parsed && parsed.errors && parsed.errors.length === 0) {
        this.props.onChange({
          rows: parsed.data,
          meta: parsed.meta,
          file,
        });
      //  } else {
      //    console.log('error')
      }
      // }
      // catch (err) {
      //   // console.log(err)
      // }
    });
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.onChange(null);
  }

  render() {
    // console.log(this.props.value)
    return (
      <Styled>
        { this.props.value &&
          <DocumentWrapEdit>
            <FileName>{this.props.value.file.name}</FileName>
            <Remove onClick={this.handleRemove}>
              <Icon name="removeLarge" />
            </Remove>
            <ImportButton type="submit" primary>
              {`Import ${this.props.value.rows.length} row(s)`}
            </ImportButton>
          </DocumentWrapEdit>
        }
        { !this.props.value &&
          <FileReaderInput
            as={this.props.as}
            accept={this.props.accept}
            onChange={this.handleChange}
          >
            <ButtonDefaultWithIcon type="button" title="Select File" icon="add" />
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

export default SelectFile;
