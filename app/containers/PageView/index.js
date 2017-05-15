/*
 *
 * PageView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE, PUBLISH_STATUSES } from 'containers/App/constants';

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

  render() {
    const { page, dataReady, isAdmin, isContributor } = this.props;
    const reference = this.props.params.id;
    const status = page && find(PUBLISH_STATUSES, { value: page.attributes.draft });

    let asideFields = page && [{
      id: 'number',
      heading: 'Number',
      value: reference,
    }];
    if (page && isContributor) {
      asideFields = asideFields.concat([
        {
          id: 'status',
          heading: 'Status',
          value: status && status.label,
        },
        {
          id: 'updated',
          heading: 'Updated At',
          value: page.attributes.updated_at,
        },
        {
          id: 'updated_by',
          heading: 'Updated By',
          value: page.user && page.user.attributes.name,
        },
      ]);
    }
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
          title={page ? page.attributes.title : `${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={page ? page.attributes.title : this.context.intl.formatMessage(messages.loading)}
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
          { page &&
            <EntityView
              fields={{
                header: isAdmin ? {
                  main: [
                    {
                      id: 'menu_title',
                      heading: 'Menu title',
                      value: page.attributes.menu_title,
                    },
                  ],
                  aside: asideFields,
                } : null,
                body: {
                  main: [
                    {
                      id: 'content',
                      heading: isAdmin ? 'Content' : '',
                      value: page.attributes.content,
                    },
                  ],
                  aside: [],
                },
              }}
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
