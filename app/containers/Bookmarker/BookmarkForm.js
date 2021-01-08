import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';
import DebounceInput from 'react-debounce-input';

import Button from 'components/buttons/Button';
import ButtonDefault from 'components/buttons/ButtonDefault';
import ButtonFlatWithIcon from 'components/buttons/ButtonFlatWithIcon';

import messages from './messages';

const Popout = styled.div`
  background-color: #fff;
  position: absolute;
  right: 0;
  text-align: left;
  width: 325px;
  border: 1px solid #333;
  margin-top: 0.5em;
  padding-top: 0.5em;
  padding-left: 0.5em;
  display: block;
`;

const Input = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  border: none;
  padding: 3px;
  &:focus {
    outline: none;
  }
  flex: 1;
  font-size: 0.85em;
`;

const ButtonIcon = styled(ButtonFlatWithIcon)`
  float: left;
`;

const ButtonUpdate = styled(ButtonDefault)`
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  float: left;
`;
const ButtonCancel = styled(Button)`
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  float: right;
`;

class BookmarkForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { title: '' };
  }
  componentWillMount() {
    if (this.props.bookmark) {
      this.setState({ title: this.props.bookmark.getIn(['attributes', 'title']) });
    }
  }
  render() {
    const { bookmark, handleUpdateTitle, handleDelete, handleCancel } = this.props;
    const { formatMessage } = this.context.intl;

    return (
      <Popout>
        <p>
          <FormattedMessage {...messages.title} />
        </p>
        <p>
          <FormattedMessage {...messages.labelTitle} />
          <br />
          <Input
            type="text"
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}
            onFocus={() => this.setState({ active: true })}
            onBlur={() => this.setState({ active: false })}
          />
        </p>

        {bookmark && <ButtonIcon
          icon="trash"
          iconRight={false}
          iconSize="24px"
          title={formatMessage(messages.buttonDelete)}
          onClick={() => {
            handleDelete();
          }}
        />}

        <ButtonUpdate
          onClick={() => {
            handleUpdateTitle(this.state.title);
          }}
        >
          <FormattedMessage {...messages.buttonUpdate} />
        </ButtonUpdate>
        <ButtonCancel
          onClick={() => handleCancel()}
        >
          <FormattedMessage {...messages.buttonCancel} />
        </ButtonCancel>
      </Popout>
    );
  }
}

BookmarkForm.propTypes = {
  bookmark: PropTypes.object,
  handleUpdateTitle: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCancel: PropTypes.func,
};

BookmarkForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};


export default BookmarkForm;
