import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import { List } from 'immutable';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';

import { DEPENDENCIES } from './constants';
import { selectBookmarks } from './selectors';

import Button from '../buttons/Button';

// const StyledButton = styled(Button)``;

const BookmarkerContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const Popout = styled.div`
  position: absolute;
  background-color: #fff;
  right: 0;
  text-align: left;
  width: 325px;
  border: 1px solid #333;
  margin-top: 0.5em;
`;

class Bookmarker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    // const { dataReady, entities } = this.props;
    const { dataReady } = this.props;

    if (dataReady) {
      // console.log('ENTITIES')
      // console.log(entities.toJS())

      return (
        <BookmarkerContainer>
          <Button onClick={() => null}>(X)</Button>
          <Popout>
            <p>Bookmark added</p>
            <p>Name</p>
            <input /><br />

            <a href="#delete">delete</a>{' | '}
            <a href="#cancel">cancel</a>{' | '}
            <a href="#done">done</a>
          </Popout>
        </BookmarkerContainer>
      );
    }

    return null;
  }

}

Bookmarker.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
  // entities: PropTypes.instanceOf(List).isRequired,
};
Bookmarker.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectBookmarks(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarker);
