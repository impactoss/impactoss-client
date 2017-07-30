import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactS3Uploader from 'react-s3-uploader';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { getPathFromUrl } from 'utils/string';

import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import DocumentView from 'components/DocumentView';
import DocumentWrap from 'components/fields/DocumentWrap';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';

import Loading from 'components/Loading';

import { API_ENDPOINT, SIGNING_URL_ENDPOINT } from 'containers/App/constants';

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('primary', 4)};
  position: relative;
  padding: 1em 0.75em;
`;

const Remove = styled(ButtonFlatIconOnly)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 1em 0.75em;
  color: ${palette('dark', 2)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;

const Uploading = styled.div`
  color: ${palette('primary', 1)};
  font-weight: bold;
  font-size: 1.2em;
`;
const Styled = styled.div`
  padding-top: 1em;
  display: block;
`;
const ReactS3UploaderLabelWrap = styled.label`
  vertical-align: middle;
  display: inline-block;
  color: ${palette('primary', 4)};
  background-color: ${palette('primary', 1)};
  border-radius: 999px;
  cursor:pointer;
  padding: 0.5em 1em 0.5em 1.25em;
  font-size: 1.25em;
  width: auto;
  &:hover {
    color: ${palette('primary', 4)};
    background-color: ${palette('primary', 0)};
  }
`;

class Upload extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {
    progress: null,
    error: null,
  }

  onUploadFinish = ({ signedUrl }) => {
    this.props.onChange(getPathFromUrl(signedUrl));
  }

  onUploadProgress = (progress) => {
    this.setState({
      progress,
    });
  }

  onUploadError = (error) => {
    this.setState({
      error,
    });
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.onChange(null);
    this.setState({
      progress: null,
    });
  }

  modifyFileType = (file, next) => {
    // This is to enable files to download by default, instead of potentially opening in browser
    const newFile = new File([file.slice()], file.name, { type: 'application/octet-stream' });
    next(newFile);
  }

  render() {
    return (
      <Styled>
        {
          this.props.value &&
          <DocumentWrapEdit>
            <DocumentView url={this.props.value} status />
            <Remove onClick={this.handleRemove}>
              <Icon name="removeLarge" />
            </Remove>
          </DocumentWrapEdit>
        }
        {
          !this.props.value &&
          !this.state.progress &&
          this.state.progress !== 0 &&
          <ReactS3UploaderLabelWrap>
            <FormattedMessage {...appMessages.attributes.document_upload} />
            <Icon name="add" text textRight />
            <ReactS3Uploader
              style={{ display: 'none' }}
              signingUrl={SIGNING_URL_ENDPOINT}
              signingUrlMethod="GET"
              signingUrlWithCredentials
              onProgress={this.onUploadProgress}
              onError={this.onUploadError}
              onFinish={this.onUploadFinish}
              server={API_ENDPOINT}
              preprocess={this.modifyFileType}
              scrubFilename={(filename) => filename.replace(/(\.[\w\d_-]+)$/i, `_${Date.now()}$1`)}
            />
          </ReactS3UploaderLabelWrap>
        }
        { (this.state.progress || this.state.progress === 0) && !this.props.value &&
          <DocumentWrapEdit>
            <Uploading>
              <FormattedMessage {...appMessages.attributes.document_uploading} />
              {` ${this.state.progress}%`}
              {this.props.value}
              <Loading
                progress={this.state.progress}
              />
            </Uploading>
          </DocumentWrapEdit>
        }
        {
          this.state.error &&
          this.state.error
        }
      </Styled>
    );
  }
}

Upload.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};
// Upload.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };
export default Upload;
