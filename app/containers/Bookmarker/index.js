import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, deleteEntity, saveEntity, newEntity } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';
import Button from 'components/buttons/Button';
import ButtonDefault from 'components/buttons/ButtonDefault';
import ButtonFlatWithIcon from 'components/buttons/ButtonFlatWithIcon';

import { DEPENDENCIES } from './constants';
import { selectBookmark, selectNewBookmarkView } from './selectors';

import messages from './messages';

const BookmarkerContainer = styled.div`
  position: relative;
  z-index: 10;
`;

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

const Input = styled.input`
  border: 1px solid #333;
`;

const ButtonIcon = styled(ButtonFlatWithIcon)`
  float: left;
`;

const ButtonDone = styled(ButtonDefault)`
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

class Bookmarker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = { open: false, title: null };
  }

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  componentDidUpdate() {
    const { dataReady, bookmark } = this.props;

    if(dataReady && bookmark && this.state.title === null) {
      this.setState({ title: bookmark.toJS().attributes.title });
    }
  }

  render() {
    const { dataReady, bookmark, newBookmarkView, handleDelete, handleDone } = this.props;
    const { formatMessage } = this.context.intl;

    if (dataReady) {
      return (
        <BookmarkerContainer>
          <Button onClick={() => this.setState({open: !this.state.open})}>
            {bookmark && '(*)'}
            {!bookmark && '( )'}
          </Button>
          {this.state.open && (
            <Popout>
              <p>
                <FormattedMessage {...messages.popoutTitle} />
              </p>
              <p>
                <FormattedMessage {...messages.popoutNameLabel} />
                <br />
                <Input type="text" value={this.state.title || ''}
                  onChange={event => this.setState({ title: event.target.value })}
                />
              </p>

              {bookmark && <ButtonIcon
                icon="trash"
                iconRight={false}
                iconSize="24px"
                title={formatMessage(messages.popoutDelete)}
                onClick={() => {
                  handleDelete(bookmark)
                  this.setState({open: false, title: ''});
                }}
              />}

              <ButtonDone onClick={() => {
                handleDone(bookmark, newBookmarkView, this.state.title);
                this.setState({open: false});
              }}>
                <FormattedMessage {...messages.popoutDone} />
              </ButtonDone>
              <ButtonCancel onClick={() => {
                const title = bookmark ? bookmark.toJS().attributes.title : null;
                this.setState({open: false, title});
              }}>
                <FormattedMessage {...messages.popoutCancel} />
              </ButtonCancel>
            </Popout>
          )}
        </BookmarkerContainer>
      );
    }

    return null;
  }

}

Bookmarker.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
};
Bookmarker.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  bookmark: selectBookmark(state),
  newBookmarkView: selectNewBookmarkView(state),
});
function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleDelete: (bookmark) => {
      const {pathname, search} = window.location

      dispatch(deleteEntity({
        path: 'bookmarks',
        id: bookmark.toJS().id,
        redirect: `${pathname.substring(1)}${search}`,
      }));
    },
    handleDone: (bookmark, newBookmarkView, newTitle) => {
      const { id, attributes } = bookmark ? bookmark.toJS() : {};
      const path = 'bookmarks';

      // update existing bookmark with new title
      if(bookmark && newTitle !== attributes.title) {
        dispatch(saveEntity({
          path, entity: { id, attributes: { ...attributes, title: newTitle } },
        }))
      }

      // create a new bookmark
      if(!bookmark) {
        dispatch(newEntity({
          path, entity: { attributes: { title: newTitle, view: newBookmarkView } },
        }))
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarker);
