/*
 *
 * Taxonomies
 *
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

// containers
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import {
  getEntity,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

// components
import Page from 'components/Page';
import CategoryList from 'components/CategoryList';


// relative
import messages from './messages';

export class TaxonomyCategories extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // make sure to load all data from server
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  mapToCategoryList = (categories) => categories && Object.values(categories).map((cat) => ({
    id: cat.id,
    title: cat.attributes.title,
    linkTo: `/category/${cat.id}`,
  }))
  handleNew = () => {
    browserHistory.push(`/categories/${this.props.taxonomy.id}/new`);
  }
  render() {
    const { taxonomy, dataReady, isManager } = this.props;

    const pageTitle = dataReady
      ? `${this.context.intl.formatMessage(messages.pageTitle)} for ${taxonomy.attributes.title}`
      : this.context.intl.formatMessage(messages.pageTitle);

    const pageActions = dataReady && isManager
      ? [{
        type: 'primary',
        title: '+ Add Category',
        onClick: this.handleNew,
      }]
      : [];

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Page
          title={pageTitle}
          actions={pageActions}
        >
          { !dataReady &&
            <div>
              <FormattedMessage {...messages.loading} />
            </div>
          }
          { dataReady &&
            <CategoryList
              categories={this.mapToCategoryList(taxonomy.categories)}
            />
          }
        </Page>
      </div>
    );
  }
}

TaxonomyCategories.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  taxonomy: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
};

TaxonomyCategories.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
  ] }),
  taxonomy: getEntity(
    state,
    {
      id: props.params.id,
      path: 'taxonomies',
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        extend: [
          {
            type: 'count',
            path: 'recommendation_categories',
            key: 'category_id',
            reverse: true,
            out: 'js',
            as: 'recommendation_count',
          },
          {
            type: 'count',
            path: 'measure_categories',
            key: 'category_id',
            reverse: true,
            out: 'js',
            as: 'action_count',
          },
        ],
      },
      out: 'js',
    }
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxonomyCategories);
