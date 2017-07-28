/*
 *
 * ReportView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getDateRelatedField,
  getDownloadField,
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserContributor,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

export class ReportView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getTitleField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity, appMessages),
      ],
    },
  ]);
  getBodyMainFields = (entity, isContributor) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true, appMessages),
        getDownloadField(entity, isContributor, appMessages),
      ],
    },
  ]);
  getBodyAsideFields = (entity) => ([ // fieldGroups
    {
      type: 'dark',
      fields: [
        getDateRelatedField(entity.getIn(['date', 'attributes', 'due_date']), 'due_date_id', appMessages, true, appMessages.entities.progress_reports.unscheduled),
      ],
    },
  ]);


  render() {
    const { viewEntity, dataReady, isContributor } = this.props;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (viewEntity && dataReady) {
      pageTitle = `${pageTitle} for indicator ${viewEntity.getIn(['attributes', 'indicator_id'])}`;
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="report"
            buttons={isContributor
              ? [
                {
                  type: 'edit',
                  onClick: this.props.handleEdit,
                },
                {
                  type: 'close',
                  onClick: () => this.props.handleClose(viewEntity.getIn(['indicator', 'id'])),
                },
              ]
              : [
                {
                  type: 'close',
                  onClick: () => this.props.handleClose(viewEntity.getIn(['indicator', 'id'])),
                },
              ]
             }
          />
          { !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { viewEntity && dataReady &&
            <EntityView
              fields={{
                header: {
                  main: this.getHeaderMainFields(viewEntity, isContributor),
                  aside: isContributor && this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity, isContributor),
                  aside: isContributor ? this.getBodyAsideFields(viewEntity) : null,
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

ReportView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleClose: PropTypes.func,
  handleEdit: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isContributor: PropTypes.bool,
  params: PropTypes.object,
};

ReportView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isContributor: selectIsUserContributor(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`/reports/edit/${props.params.id}`));
    },
    handleClose: (indicatorId) => {
      dispatch(closeEntity(`/indicators/${indicatorId}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportView);
