import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

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

const ButtonLeft = styled(ButtonDefault)`
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  float: left;
`;
const ButtonRight = styled(Button)`
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  float: right;
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

  render() {
    const { dataReady, bookmark } = this.props;
    const { formatMessage } = this.context.intl;

    if (dataReady) {
      const popoutClassName = `popout ${this.state.open ? 'open' : ''}`;

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

              <ButtonIcon
                icon="trash"
                iconRight={false}
                iconSize="24px"
                title={formatMessage(messages.popoutDelete)}
              />

              <ButtonLeft>
                <FormattedMessage {...messages.popoutDone} />
              </ButtonLeft>
              <ButtonRight>
                <FormattedMessage {...messages.popoutCancel} />
              </ButtonRight>
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
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarker);
