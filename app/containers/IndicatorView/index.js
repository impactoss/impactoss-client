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
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  isReady,
  isUserContributor,
  selectMeasureTaxonomies,
  selectSdgTargetTaxonomies,
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
        getReferenceField(entity),
        getTitleField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity, isContributor) => isContributor &&
    ([{
      fields: [
        getStatusField(entity),
        getMetaField(entity, this.context.intl.formatMessage, appMessages, this.context.intl.formatDate),
      ],
    }]);

  getBodyMainFields = (entity, measures, reports, sdgtargets, measureTaxonomies, sdgtargetTaxonomies, isContributor, onEntityClick) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true, this.context.intl.formatMessage, appMessages),
        {
          type: 'reports',
          label: this.context.intl.formatMessage(appMessages.entities.progress_reports.plural),
          values: this.mapReports(reports),
          showEmpty: this.context.intl.formatMessage(appMessages.entities.progress_reports.empty),
          button: isContributor
            ? {
              type: 'add',
              title: this.context.intl.formatMessage(messages.addReport),
              onClick: this.props.handleNewReport,
            }
            : null,
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        getMeasureConnectionField(measures, measureTaxonomies, this.context.intl.formatMessage, appMessages, onEntityClick),
        getSdgTargetConnectionField(sdgtargets, sdgtargetTaxonomies, this.context.intl.formatMessage, appMessages, onEntityClick),
      ],
    },
  ]);

  getBodyAsideFields = (entity, dates) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.schedule),
      type: 'dark',
      icon: 'reminder',
      fields: [
        {
          label: this.context.intl.formatMessage(appMessages.entities.due_dates.plural),
          type: 'schedule',
          values: this.mapDates(dates),
          showEmpty: this.context.intl.formatMessage(appMessages.entities.due_dates.empty),
        },
        getManagerField(
          entity,
          this.context.intl.formatMessage,
          appMessages.attributes.manager_id.indicators,
          appMessages.attributes.manager_id.indicatorsEmpty
        ),
      ],
    },
  ]);

  mapReports = (reports) => reports
    ? reports.map((report) => ({
      label: report.getIn(['attributes', 'title']),
      dueDate: report.get('due_date') ? this.context.intl.formatDate(new Date(report.getIn(['due_date', 'attributes', 'due_date']))) : null,
      linkTo: `/reports/${report.get('id')}`,
    })).toList()
    : [];

  mapDates = (dates) => dates
  ? dates.map((date) => ({
    label: this.context.intl.formatDate(new Date(date.getIn(['attributes', 'due_date']))),
    due: date.getIn(['attributes', 'due']),
    overdue: date.getIn(['attributes', 'overdue']),
  })).toList()
  : [];

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
    } = this.props;
    // measures && console.log(measures.toJS())
    // sdgtargets && console.log(sdgtargets.toJS())
    // reports && console.log(reports.toJS())
    // dates && console.log(dates.toJS())

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
          { !viewEntity && !dataReady &&
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
                  main: this.getBodyMainFields(viewEntity, measures, reports, sdgtargets, measureTaxonomies, sdgtargetTaxonomies, isContributor, onEntityClick),
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
};

IndicatorView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isContributor: isUserContributor(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  sdgtargetTaxonomies: selectSdgTargetTaxonomies(state),
  measures: selectMeasures(state, props.params.id),
  measureTaxonomies: selectMeasureTaxonomies(state),
  reports: selectReports(state, props.params.id),
  dates: selectDueDates(state, props.params.id),
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
      dispatch(updatePath('/indicators'));
      // TODO should be "go back" if history present or to indicators list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);
