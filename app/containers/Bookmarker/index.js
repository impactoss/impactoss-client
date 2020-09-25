import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';
import Button from 'components/buttons/Button';
import ButtonDefault from 'components/buttons/ButtonDefault';
import ButtonFlatWithIcon from 'components/buttons/ButtonFlatWithIcon';

import { DEPENDENCIES } from './constants';
import { selectBookmark } from './selectors';

import messages from './messages';

const BookmarkerContainer = styled.div`
  position: relative;
  z-index: 10;

  .popout {
    position: absolute;
    background-color: #fff;
    right: 0;
    text-align: left;
    width: 325px;
    border: 1px solid #333;
    margin-top: 0.5em;
    padding-top: 0.5em;
    padding-left: 0.5em;
    display: none;

    &.open {
      display: block;
    }

    input {
      border: 1px solid #333;
    }

    button {
      text-transform: uppercase;
      font-size: 0.75em;
      font-weight: bold;

      &.float-left {
        float: left;
      }

      &.float-right {
        float: right;
      }
    }
  }
`;

class Bookmarker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = { open: false, title: null }
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
      this.setState({ title: bookmark.toJS().attributes.title })
    }
  }

  getBookmarkIcon() {
    const { dataReady, bookmark } = this.props;

    return dataReady && bookmark ? '(*)' : '( )';
  }

  render() {
    const { dataReady, bookmark } = this.props;
    const { formatMessage } = this.context.intl;

    if (dataReady) {
      const popoutClassName = `popout ${this.state.open ? 'open' : ''}`;

      return (
        <BookmarkerContainer>
          <Button onClick={() => this.setState({open: !this.state.open})}>{this.getBookmarkIcon()}</Button>
          <div className={popoutClassName}>
            <p>{formatMessage(messages.popoutTitle)}</p>
            <p>
              {formatMessage(messages.popoutNameLabel)}<br />
              <input type="text" value={this.state.title || ''}
                onChange={event => this.setState({ title: event.target.value })}
              />
            </p>

            <ButtonFlatWithIcon
              className="float-left"
              icon="trash"
              iconRight={false}
              iconSize="24px"
              title={formatMessage(messages.popoutDelete)}
            />

            <ButtonDefault className="float-right">
              {formatMessage(messages.popoutDone)}
            </ButtonDefault>
            <Button className="float-right">
              {formatMessage(messages.popoutCancel)}
            </Button>
          </div>
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
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarker);
