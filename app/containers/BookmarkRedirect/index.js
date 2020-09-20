/*
 *
 * BookmarkRedirect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';

import Footer from 'containers/Footer';
import Container from 'components/styled/Container';
import ContentHeader from 'components/ContentHeader';

import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

const ViewContainer = styled(Container)`
  min-height: 100vH;
`;

export class BookmarkRedirect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getEntries = (subView) => (Object.entries(subView)
    .filter(([, value]) => value) // filter out if parameter is not defined
  )

  getErrorView(message) {
    const pageTitle = this.context.intl.formatMessage(messages.pageTitle);

    return (
      <div>
        <Helmet title={pageTitle} />
        <ViewContainer>
          <ContentHeader title={pageTitle} />
          <FormattedMessage {...message} />
        </ViewContainer>
        <Footer />
      </div>
    );
  }

  render() {
    const { bookmark, dataReady } = this.props;

    if (dataReady) {
      if (!bookmark) {
        return this.getErrorView(messages.notFound);
      }

      const view = bookmark.getIn(['attributes', 'view']).toJS();
      if (!view.type) {
        return this.getErrorView(messages.invalid);
      }

      const {
        type,
        subgroup, group, expand, sort, order,
        cat, catx, where, connected,
      } = view;

      const singleValue = this.getEntries({ subgroup, group, expand, sort, order })
        .map((entry) => entry.join('='));
      const cats = (cat || []).map((id) => `cat=${id}`);
      const multiValue = this.getEntries({ catx, where, connected })
        .flatMap(
          ([filter, objects]) => objects.map(
            ({ key, value }) => `${filter}=${key}:${value}`
          )
        );

      const queryParts = [...singleValue, ...cats, ...multiValue];

      // redirecting to built url
      window.location.href = `/${type}?${queryParts.join('&')}`;
    }

    return null;
  }
}

BookmarkRedirect.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  bookmark: PropTypes.object,
  dataReady: PropTypes.bool,
};

BookmarkRedirect.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  bookmark: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkRedirect);
