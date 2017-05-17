/*
 *
 * PageView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  getEntity,
  isReady,
  isUserAdmin,
  isUserContributor,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

export class PageView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isContributor) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          type: 'title',
          label: 'Menu title',
          value: entity.attributes.menu_title,
          isManager: isContributor,
        },
      ],
    },
  ]);
  getHeaderAsideFields = (entity, isContributor) => {
    if (!isContributor) {
      return [
        {
          fields: [
            {
              type: 'referenceStatus',
              fields: [
                {
                  type: 'reference',
                  value: entity.id,
                  large: true,
                },
              ],
            },
          ],
        },
      ];
    }
    return [
      {
        fields: [
          {
            type: 'referenceStatus',
            fields: [
              {
                type: 'reference',
                value: entity.id,
              },
              {
                type: 'status',
                value: entity.attributes.draft,
              },
            ],
          },
          {
            type: 'meta',
            fields: [
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
                value: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
              },
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
                value: entity.user && entity.user.attributes.name,
              },
            ],
          },
        ],
      },
    ];
  }
  getBodyMainFields = (entity) => ([
    {
      fields: [
        {
          type: 'description',
          value: entity.attributes.content,
        },
      ],
    },
  ]);

  getFields = (entity, isContributor) => ({
    header: {
      main: this.getHeaderMainFields(entity, isContributor),
      aside: this.getHeaderAsideFields(entity, isContributor),
    },
    body: {
      main: this.getBodyMainFields(entity, isContributor),
    },
  })


  render() {
    const { page, dataReady, isAdmin, isContributor } = this.props;

    const buttons = isAdmin
    ? [
      {
        type: 'edit',
        onClick: this.props.handleEdit,
      },
      {
        type: 'close',
        onClick: this.props.handleClose,
      },
    ]
    : [{
      type: 'close',
      onClick: this.props.handleClose,
    }];

    return (
      <div>
        <Helmet
          title={page ? page.attributes.title : `${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={page ? page.attributes.title : ''}
            type={CONTENT_SINGLE}
            buttons={buttons}
          />
          { !page && !dataReady &&
            <Loading />
          }
          { !page && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { page && dataReady &&
            <EntityView
              fields={this.getFields(page, isContributor)}
            />
          }
        </Content>
      </div>
    );
  }
}

PageView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  page: PropTypes.object,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isContributor: PropTypes.bool,
  params: PropTypes.object,
};

PageView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isAdmin: isUserAdmin(state),
  isContributor: isUserContributor(state),
  dataReady: isReady(state, { path: [
    'pages',
    'users',
    'user_roles',
  ] }),
  page: getEntity(
    state,
    {
      id: props.params.id,
      path: 'pages',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
      ],
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('pages'));
    },
    handleEdit: () => {
      dispatch(updatePath(`/pages/edit/${props.params.id}`));
    },
    handleClose: () => {
      dispatch(updatePath('/pages'));
      // TODO should be "go back" if history present or to pages list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageView);
