import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getBookmarkForSaving, generateBookmarkTitle } from 'utils/bookmark';

import { loadEntitiesIfNeeded, deleteEntity, saveEntity, newEntity } from 'containers/App/actions';
import { selectReady, selectLocation, selectEntities } from 'containers/App/selectors';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import BookmarkForm from './BookmarkForm';
import { DEPENDENCIES } from './constants';
import { selectBookmarkForLocation } from './selectors';

const BookmarkerContainer = styled.div`
  position: relative;
  z-index: 10;
`;

class Bookmarker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      new: true,
      open: false,
    };
  }

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  //
  // const { dataReady, bookmark } = this.props;
  //
  // if (dataReady && bookmark && this.state.title === null) {
    //   this.setState({ title: bookmark.getIn(['attributes', 'title']) });
    // } else {
      //   this.setState({ title: '' });
      // }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const {
      dataReady,
      bookmark,
      handleDelete,
      handleNew,
      handleUpdateTitle,
      location,
      bookmarks,
      viewTitle,
      type,
    } = this.props;

    if (dataReady) {
      return (
        <BookmarkerContainer>
          <Button
            onClick={
              () => {
                if (!bookmark) {
                  this.setState({
                    new: true,
                    open: true,
                  });
                  handleNew(
                    location,
                    generateBookmarkTitle(
                      location,
                      bookmarks,
                      viewTitle,
                    ),
                    type,
                  );
                } else {
                  this.setState({
                    new: false,
                    open: !this.state.open,
                  });
                }
              }
            }
          >
            {bookmark && <Icon name="bookmark_active" />}
            {!bookmark && <Icon name="bookmark_inactive" />}
          </Button>
          {this.state.open && bookmark && (
            <BookmarkForm
              bookmark={bookmark}
              isNew={this.state.new}
              handleUpdateTitle={
                (title) => {
                  handleUpdateTitle(bookmark, title);
                  this.setState({ open: false });
                }
              }
              handleCancel={
                () => this.setState({ open: false })
              }
              handleDelete={
                () => {
                  handleDelete(bookmark.get('id'));
                  this.setState({ open: false });
                }
              }
            />
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
  handleNew: PropTypes.func,
  handleUpdateTitle: PropTypes.func,
  handleDelete: PropTypes.func,
  bookmark: PropTypes.object,
  bookmarks: PropTypes.object,
  location: PropTypes.object,
  viewTitle: PropTypes.string,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  bookmark: selectBookmarkForLocation(state),
  bookmarks: selectEntities(state, 'bookmarks'),
  location: selectLocation(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleDelete: (id) => {
      dispatch(deleteEntity({
        path: 'bookmarks',
        id,
        redirect: false,
      }));
    },
    handleNew: (location, title, type) => {
      dispatch(newEntity({
        path: 'bookmarks',
        entity: {
          attributes: {
            title,
            view: getBookmarkForSaving(location, type),
          },
        },
      }));
    },
    handleUpdateTitle: (bookmark, title) => {
      dispatch(saveEntity({
        path: 'bookmarks',
        entity: {
          id: bookmark.get('id'),
          attributes: {
            view: bookmark.getIn(['attributes', 'view']),
            title,
          },
        },
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarker);
