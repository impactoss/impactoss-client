/*
 *
 * PageView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserAdmin,
  selectIsUserContributor,
} from 'containers/App/selectors';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
} from 'utils/fields';

import appMessages from 'containers/App/messages';
import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

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

  getHeaderMainFields = (entity) => ([{
    fields: [getTitleField(entity, true)],
  }]);
  getHeaderAsideFields = (entity) => ([{
    fields: [
      getStatusField(entity),
      getMetaField(entity, appMessages),
    ],
  }]);
  getBodyMainFields = (entity) => ([{
    fields: [getMarkdownField(entity, 'content', true, appMessages)],
  }]);

  getFields = (entity, isContributor) => ({
    header: isContributor
      ? {
        main: this.getHeaderMainFields(entity),
        aside: this.getHeaderAsideFields(entity),
      }
      : null,
    body: {
      main: this.getBodyMainFields(entity),
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
          title={page ? page.getIn(['attributes', 'title']) : `${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={page ? page.getIn(['attributes', 'title']) : ''}
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
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isAdmin: selectIsUserAdmin(state),
  isContributor: selectIsUserContributor(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  page: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`/pages/edit/${props.params.id}`));
    },
    handleClose: () => {
      dispatch(closeEntity('/pages'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageView);
