/*
 *
 * Taxonomies
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// containers
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import {
  getEntity,
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

  mapToCategoryList = (categories) => Object.values(categories).map((cat) => ({
    id: cat.id,
    title: cat.attributes.title,
    linkTo: `/category/${cat.id}`,
  }))

  render() {
    const { taxonomy } = this.props;

    const categories = taxonomy && this.mapToCategoryList(taxonomy.categories);

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !taxonomy &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        {taxonomy &&
          <Page
            title={`${this.context.intl.formatMessage(messages.pageTitle)} for ${taxonomy.attributes.title}`}
            actions={[]}
          >
            <CategoryList
              categories={categories}
            />
          </Page>
        }
      </div>
    );
  }
}

TaxonomyCategories.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  taxonomy: PropTypes.object,
};

TaxonomyCategories.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
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
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaxonomyCategories);
