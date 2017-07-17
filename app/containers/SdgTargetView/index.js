/*
 *
 * SdgTargetView
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
  getIndicatorConnectionField,
  getMeasureConnectionField,
  getTaxonomyFields,
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  isReady,
  isUserManager,
  selectMeasureTaxonomies,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectMeasures,
  selectIndicators,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class SdgTargetView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity, appMessages),
      ],
    },
  ]);

  getBodyMainFields = (entity, indicators, measures, measureTaxonomies, onEntityClick) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true, appMessages),
      ],
    },
    {
      label: appMessages.entities.connections.plural,
      icon: 'connections',
      fields: [
        getIndicatorConnectionField(indicators, appMessages, onEntityClick),
        getMeasureConnectionField(measures, measureTaxonomies, appMessages, onEntityClick),
      ],
    },
  ]);
  getBodyAsideFields = (entity, taxonomies) => ([
    { // fieldGroup
      label: appMessages.entities.taxonomies.plural,
      icon: 'categories',
      fields: getTaxonomyFields(taxonomies, appMessages),
    },
  ]);

  render() {
    const {
      viewEntity,
      dataReady,
      isManager,
      indicators,
      taxonomies,
      measures,
      measureTaxonomies,
      onEntityClick,
    } = this.props;

    const buttons = isManager
    ? [
      {
        type: 'edit',
        onClick: () => this.props.handleEdit(this.props.params.id),
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
            icon="sdgtargets"
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
                  main: this.getHeaderMainFields(viewEntity, isManager),
                  aside: isManager && this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity, indicators, measures, measureTaxonomies, onEntityClick),
                  aside: this.getBodyAsideFields(viewEntity, taxonomies),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

SdgTargetView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onEntityClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.object,
  indicators: PropTypes.object,
  measures: PropTypes.object,
  measureTaxonomies: PropTypes.object,
  params: PropTypes.object,
};

SdgTargetView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  measureTaxonomies: selectMeasureTaxonomies(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (sdgtargetId) => {
      dispatch(updatePath(`/sdgtargets/edit/${sdgtargetId}`));
    },
    handleClose: () => {
      dispatch(updatePath('/sdgtargets'));
      // TODO should be "go back" if history present or to sdgtargets list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetView);
