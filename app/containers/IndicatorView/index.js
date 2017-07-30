/*
 *
 * IndicatorView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getReferenceField,
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getMeasureConnectionField,
  getSdgTargetConnectionField,
  getManagerField,
  getScheduleField,
  getReportsField,
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
  selectMeasureTaxonomies,
  selectSdgTargetTaxonomies,
  selectMeasureConnections,
  selectSdgTargetConnections,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectMeasures,
  selectSdgTargets,
  selectReports,
  selectDueDates,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class IndicatorView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
        getReferenceField(entity, true),
        getTitleField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity, isContributor) => isContributor &&
    ([{
      fields: [
        getStatusField(entity),
        getMetaField(entity, appMessages),
      ],
    }]);

  getBodyMainFields = (entity, measures, reports, sdgtargets, measureTaxonomies, sdgtargetTaxonomies, isContributor, onEntityClick, sdgtargetConnections, measureConnections) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true, appMessages),
        getReportsField(
          reports,
          appMessages,
          isContributor && {
            type: 'add',
            title: this.context.intl.formatMessage(messages.addReport),
            onClick: this.props.handleNewReport,
          }
        ),
      ],
    },
    {
      label: appMessages.entities.connections.plural,
      icon: 'connections',
      fields: [
        getMeasureConnectionField(measures, measureTaxonomies, measureConnections, appMessages, onEntityClick),
        getSdgTargetConnectionField(sdgtargets, sdgtargetTaxonomies, sdgtargetConnections, appMessages, onEntityClick),
      ],
    },
  ]);

  getBodyAsideFields = (entity, dates) => ([ // fieldGroups
    { // fieldGroup
      label: appMessages.entities.due_dates.schedule,
      type: 'dark',
      icon: 'reminder',
      fields: [
        getScheduleField(
          dates,
          appMessages,
        ),
        getManagerField(
          entity,
          appMessages.attributes.manager_id.indicators,
          appMessages.attributes.manager_id.indicatorsEmpty
        ),
      ],
    },
  ]);

  render() {
    const {
      viewEntity,
      dataReady,
      isContributor,
      measures,
      sdgtargets,
      reports,
      dates,
      measureTaxonomies,
      sdgtargetTaxonomies,
      onEntityClick,
      sdgtargetConnections,
      measureConnections,
    } = this.props;

    const buttons = isContributor
    ? [
      {
        type: 'text',
        title: this.context.intl.formatMessage(messages.addReport),
        onClick: this.props.handleNewReport,
      },
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
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={buttons}
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
                  aside: this.getHeaderAsideFields(viewEntity, isContributor),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity, measures, reports, sdgtargets, measureTaxonomies, sdgtargetTaxonomies, isContributor, onEntityClick, sdgtargetConnections, measureConnections),
                  aside: isContributor ? this.getBodyAsideFields(viewEntity, dates) : null,
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

IndicatorView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onEntityClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  handleNewReport: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isContributor: PropTypes.bool,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  reports: PropTypes.object,
  measureTaxonomies: PropTypes.object,
  sdgtargetTaxonomies: PropTypes.object,
  dates: PropTypes.object,
  params: PropTypes.object,
  measureConnections: PropTypes.object,
  sdgtargetConnections: PropTypes.object,
};

IndicatorView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isContributor: selectIsUserContributor(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  sdgtargetTaxonomies: selectSdgTargetTaxonomies(state),
  measures: selectMeasures(state, props.params.id),
  measureTaxonomies: selectMeasureTaxonomies(state),
  reports: selectReports(state, props.params.id),
  dates: selectDueDates(state, props.params.id),
  measureConnections: selectMeasureConnections(state),
  sdgtargetConnections: selectSdgTargetConnections(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: () => {
      dispatch(updatePath(`/indicators/edit/${props.params.id}`));
    },
    handleNewReport: () => {
      dispatch(updatePath(`/reports/new/${props.params.id}`));
    },
    handleClose: () => {
      dispatch(closeEntity('/indicators'));
      // TODO should be "go back" if history present or to indicators list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);
