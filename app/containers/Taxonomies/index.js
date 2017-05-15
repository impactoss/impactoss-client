/*
 *
 * Taxonomies
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { mapToTaxonomyList } from 'utils/taxonomies';
import Loading from 'components/Loading';

// containers
import {
  loadEntitiesIfNeeded,
  updatePath,
} from 'containers/App/actions';

import {
  getEntities,
  isReady,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';

// components
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import TaxonomyList from 'components/TaxonomyList';
import ContentLead from 'components/basic/ContentLead';

// relative
import messages from './messages';

export class Taxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { dataReady, taxonomies, onPageLink } = this.props;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.title)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            type={CONTENT_LIST}
            icon="categories"
            supTitle={this.context.intl.formatMessage(messages.supTitle)}
            title={this.context.intl.formatMessage(messages.title)}
          />
          <ContentLead>
            <FormattedMessage {...messages.lead} />
          </ContentLead>
          { !dataReady &&
            <Loading />
          }
          { dataReady &&
            <TaxonomyList
              taxonomies={mapToTaxonomyList(taxonomies, onPageLink)}
            />
          }
        </Content>
      </div>
    );
  }
}

Taxonomies.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
};

Taxonomies.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
    // 'recommendation_categories',
    // 'measure_categories',
  ] }),
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      extend: {
        type: 'count',
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        as: 'count',
      },
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Taxonomies);
