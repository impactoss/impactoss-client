/*
 *
 * CategoryView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class CategoryView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { category, categoriesReady } = this.props;

    return (
      <div>
        <Helmet
          title="TODO: use component messages"
          meta={[
            { name: 'description', content: 'TODO: use component messages' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        { !category && !categoriesReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !category && categoriesReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { category &&
          <div>
            <h1>{category.attributes.title}</h1>
          </div>
        }
        { category &&
        <Link to={`/category/edit/${category.id}`}><button>Edit Category</button></Link> }
      </div>
    );
  }
}

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  category: PropTypes.object,
  categoriesReady: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  categoriesReady: isReady(state, { path: 'categories' }),
  category: getEntity(
    state,
    {
      id: props.params.id,
      path: 'categories',
      out: 'js',
      extend: [{
        type: 'single',
        path: 'taxonomies',
        key: 'taxonomy_id',
        as: 'taxonomy',
      }, {
        path: 'measure_categories',
        key: 'category_id',
        reverse: true,
        as: 'taggingActions',
        extend: {
          type: 'single',
          path: 'measures',
          key: 'measure_id',
          as: 'action',
        },
      }, {
        path: 'recommendation_categories',
        key: 'category_id',
        reverse: true,
        as: 'taggingRecommendations',
        extend: {
          type: 'single',
          path: 'recommendations',
          key: 'recommendation_id',
          as: 'recommendation',
        },
      }],
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
