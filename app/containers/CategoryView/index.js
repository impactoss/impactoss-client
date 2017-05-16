/*
 *
 * CategoryView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { CONTENT_SINGLE } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  getEntity,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
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
  getCategoryShortTitle = (category) => {
    const title = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
      ? category.attributes.short_title
      : category.attributes.title);
    return title.length > 10 ? `${title.substring(0, 10)}...` : title;
  }
  getCategoryAnchor = (url) => {
    const urlNoProtocol = url.replace(/^https?:\/\//i, '');
    return urlNoProtocol.length > 40
      ? `${urlNoProtocol.substring(0, 40)}...`
      : urlNoProtocol;
  }
  render() {
    const { category, dataReady, isManager } = this.props;
    const reference = this.props.params.id;

    const buttons = dataReady && isManager
    ? [
      {
        type: 'edit',
        onClick: () => this.props.handleEdit(this.props.params.id),
      },
      {
        type: 'close',
        onClick: () => this.props.handleClose(this.props.category.taxonomy.id),
      },
    ]
    : [{
      type: 'close',
      onClick: () => this.props.handleClose(this.props.category.taxonomy.id),
    }];

    const mainAsideFields = dataReady
    ? [
      {
        type: 'dark',
        fields: [
          {
            type: 'link',
            value: category.attributes.url,
            anchor: this.getCategoryAnchor(category.attributes.url),
          },
        ],
      },
    ]
    : null;
    if (dataReady
      && isManager
      && !!category.taxonomy.attributes.has_manager
    ) {
      mainAsideFields.push({
        type: 'dark',
        fields: [{
          type: 'manager',
          value: category.manager && category.manager.attributes.name,
          showEmpty: this.context.intl.formatMessage(appMessages.attributes.manager_id.categoriesEmpty),
        }],
      });
    }

    const fields = dataReady ? {
      header: {
        main: [ // fieldGroups
          { // fieldGroup
            fields: [
              {
                type: 'title',
                value: category.attributes.title,
                isManager,
              },
              {
                type: 'short_title',
                value: this.getCategoryShortTitle(category),
                taxonomyId: category.attributes.taxonomy_id,
              },
            ],
          },
        ],
        aside: isManager
        ? [
          {
            fields: [
              {
                type: 'referenceStatus',
                fields: [
                  {
                    type: 'reference',
                    value: reference,
                    large: true,
                  },
                  // {
                  //   type: 'status',
                  //   value: true,
                  // },
                ],
              },
              {
                type: 'meta',
                fields: [
                  {
                    label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
                    value: this.context.intl.formatDate(new Date(category.attributes.updated_at)),
                  },
                  {
                    label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
                    value: category.user && category.user.attributes.name,
                  },
                ],
              },
            ],
          },
        ]
        : null,
      },
      body: {
        main: {
          fields: [
            {
              type: 'description',
              value: category.attributes.description,
            },
          ],
        },
        aside: mainAsideFields,
      },
    }
    : null;


    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={buttons}
          />
          { !category && !dataReady &&
            <Loading />
          }
          { !category && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { category && dataReady &&
            <EntityView fields={fields} />
          }
        </Content>
      </div>
    );
  }
}

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  isManager: PropTypes.bool,
};

CategoryView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
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
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleEdit: (categoryId) => {
      dispatch(updatePath(`/category/edit/${categoryId}`));
    },
    handleClose: (taxonomyId) => {
      dispatch(updatePath(`/categories/${taxonomyId}`));
      // TODO should be "go back" if history present or to categories list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
