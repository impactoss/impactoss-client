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
  getEntityLinkField,
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
  getHeaderMainFields = (entity, isManager, indicator) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getTitleField(entity, isManager),
        getEntityLinkField(indicator, 'indicators', appMessages.entities.indicators.single),
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
        getDownloadField(entity, entity.getIn(['attributes', 'document_public']) || isContributor, appMessages),
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
            title={this.context.intl.formatMessage(messages.pageTitle)}
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
                  main: this.getHeaderMainFields(viewEntity, isContributor, viewEntity.get('indicator')),
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
