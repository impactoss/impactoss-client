import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';
import DebounceInput from 'react-debounce-input';

import ButtonFlatWithIcon from 'components/buttons/ButtonFlatWithIcon';

import FormWrapper from 'components/forms/FormWrapper';
import FormBody from 'components/forms/FormBody';
import FormFooter from 'components/forms/FormFooter';
import FormFooterButtons from 'components/forms/FormFooterButtons';
import FormFieldWrap from 'components/forms/FormFieldWrap';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import Field from 'components/fields/Field';
import GroupLabel from 'components/fields/GroupLabel';
import FieldLabel from 'components/forms/Label';

import Clear from 'components/styled/Clear';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Main from 'components/EntityView/Main';

import messages from './messages';

const Styled = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 340px;
  display: block;
  text-align: left;
  margin-top: 3px;
`;
const StyledForm = styled.form`
  position: relative;
  display: table;
  width: 100%;
`;

const Input = styled(DebounceInput)`
  width: 100%;
  background-color: ${palette('light', 0)};
  border: 1px solid ${palette('light', 1)};
  padding: 0.7em;
  border-radius: 0.5em;
`;

const StyledFieldGroupWrapper = styled(FieldGroupWrapper)`
  padding: 10px 15px 0;
`;
const StyledGroupLabel = styled(GroupLabel)`
  font-size: 1.2em;
`;
const ButtonIcon = styled(ButtonFlatWithIcon)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  padding-left: 10px;
  padding-right: 10px;
`;

class BookmarkForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      edited: false,
      valid: true,
    };
  }
  UNSAFE_componentWillMount() {
    if (this.props.bookmark) {
      this.setState({ title: this.props.bookmark.getIn(['attributes', 'title']) });
    }
  }
  render() {
    const { bookmark, handleUpdateTitle, handleDelete, handleCancel, isNew } = this.props;
    const { formatMessage } = this.context.intl;

    return (
      <Styled>
        <FormWrapper white>
          <StyledForm>
            <FormBody>
              <Main>
                <StyledFieldGroupWrapper type="">
                  <FieldGroupLabel>
                    <StyledGroupLabel>
                      {isNew && (
                        <FormattedMessage {...messages.titleNew} />
                      )}
                      {!isNew && (
                        <FormattedMessage {...messages.titleEdit} />
                      )}
                    </StyledGroupLabel>
                  </FieldGroupLabel>
                  <Field>
                    <FormFieldWrap>
                      <FieldLabel htmlFor="titleField" >
                        <FormattedMessage {...messages.labelTitle} />
                      </FieldLabel>
                      <Input
                        id="titleField"
                        type="text"
                        value={this.state.title}
                        placeholder={this.context.intl.formatMessage(messages.placeholder)}
                        autoFocus
                        onFocus={(e) => {
                          e.currentTarget.select();
                          this.setState({ active: true });
                        }}
                        onBlur={() => this.setState({ active: false })}
                        onChange={(e) =>
                          this.setState({
                            title: e.target.value,
                            edited: e.target.value.trim() !== bookmark.getIn(['attributes', 'title']),
                            valid: e.target.value.trim().length > 0,
                          })}
                      />
                    </FormFieldWrap>
                  </Field>
                </StyledFieldGroupWrapper>
              </Main>
            </FormBody>
            <FormFooter>
              <FormFooterButtons>
                <ButtonCancel type="button" onClick={handleCancel}>
                  {this.state.edited && (
                    <FormattedMessage {...messages.buttonCancel} />
                  )}
                  {!this.state.edited && (
                    <FormattedMessage {...messages.buttonClose} />
                  )}
                </ButtonCancel>
                {this.state.edited && this.state.valid && (
                  <ButtonSubmit
                    type="button"
                    onClick={() => {
                      handleUpdateTitle(this.state.title.trim());
                    }}
                  >
                    <FormattedMessage {...messages.buttonUpdate} />
                  </ButtonSubmit>
                )}
              </FormFooterButtons>
              <FormFooterButtons left>
                <ButtonIcon
                  icon="trash"
                  strong
                  iconRight={false}
                  title={formatMessage(messages.buttonDelete)}
                  onClick={() => {
                    handleDelete();
                  }}
                />
              </FormFooterButtons>
              <Clear />
            </FormFooter>
          </StyledForm>
        </FormWrapper>
      </Styled>
    );
  }
}

BookmarkForm.propTypes = {
  bookmark: PropTypes.object,
  handleUpdateTitle: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCancel: PropTypes.func,
  isNew: PropTypes.bool,
};

BookmarkForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default BookmarkForm;
