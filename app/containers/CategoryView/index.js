/*
 *
 * CategoryView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class CategoryView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  handleEdit = () => {
    browserHistory.push(`/category/edit/${this.props.params.id}`);
  }

  handleClose = () => {
    browserHistory.push(`/categories/${this.props.category.taxonomy.id}`);
    // TODO should be "go back" if history present or to categories list when not
  }

  render() {
    const { category, dataReady } = this.props;
    const reference = this.props.params.id;
    const mainAsideFields = [];
    if (dataReady && !!category.taxonomy.attributes.has_manager) {
      mainAsideFields.push({
        id: 'manager',
        heading: 'Category manager',
        value: category.manager && category.manager.attributes.name,
      });
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !category && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !category && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { category && dataReady &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Edit',
                onClick: this.handleEdit,
              },
              {
                type: 'primary',
                title: 'Close',
                onClick: this.handleClose,
              },
            ]}
          >
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: category.attributes.title,
                    },
                  ],
                  aside: [
                    {
                      id: 'number',
                      heading: 'Number',
                      value: reference,
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: category.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: category.user && category.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      heading: 'Description',
                      value: category.attributes.description,
                    },
                    {
                      id: 'short_title',
                      heading: 'Short title',
                      value: category.attributes.short_title,
                    },
                    {
                      id: 'url',
                      heading: 'URL',
                      value: category.attributes.url,
                    },
                  ],
                  aside: mainAsideFields,
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  category: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

CategoryView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'categories',
    'users',
    'taxonomies',
    'recommendation_categories',
    'measure_categories',
    'measures',
    'recommendations',
  ] }),
  category: getEntity(
    state,
    {
      id: props.params.id,
      path: 'categories',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
        {
          type: 'single',
          path: 'users',
          key: 'manager_id',
          as: 'manager',
        },
        {
          type: 'single',
          path: 'taxonomies',
          key: 'taxonomy_id',
          as: 'taxonomy',
        }, {
          path: 'measure_categories',
          key: 'category_id',
          reverse: true,
          as: 'actions',
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
          as: 'recommendations',
          extend: {
            type: 'single',
            path: 'recommendations',
            key: 'recommendation_id',
            as: 'recommendation',
          },
        },
      ],
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
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
