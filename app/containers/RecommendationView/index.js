/*
 *
 * RecommendationView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getReferenceField,
  getTitleTextField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getMeasureConnectionField,
  getIndicatorConnectionField,
  getTaxonomyFields,
  hasTaxonomyCategories,
} from 'utils/fields';
import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, getEntityReference } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { ACCEPTED_STATUSES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectMeasureTaxonomies,
  selectMeasureConnections,
  selectIndicatorConnections,
  selectActiveFrameworks,
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

export class RecommendationView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // shouldComponentUpdate(nextProps) {
  //   console.log('RecommendationView.shouldComponentUpdate')
  //   console.log(this.props.viewEntity === nextProps.viewEntity)
  //   console.log(this.props.taxonomies === nextProps.taxonomies)
  //   console.log(this.props.measures === nextProps.measures)
  //   console.log(this.props.dataReady === nextProps.dataReady)
  //   // console.log(isEqual(this.props.locationQuery, nextProps.locationQuery))
  //   // console.log(this.props.locationQuery === nextProps.locationQuery)
  //   // console.log(typeof this.props.scrollContainer !== typeof nextProps.scrollContainer)
  //   return this.props.viewEntity !== nextProps.viewEntity
  //     || this.props.taxonomies !== nextProps.taxonomies
  //     || this.props.dataReady !== nextProps.dataReady
  //     || this.props.measures !== nextProps.measures
  // }
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceField(entity, isManager),
        getTitleTextField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity),
      ],
    },
  ]);


  getBodyMainFields = (
    entity,
    measures,
    measureTaxonomies,
    measureConnections,
    indicators,
    indicatorConnections,
    onEntityClick,
    hasResponse,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true, 'fullRecommendation'),
        hasResponse && getStatusField(
          entity,
          'accepted',
          ACCEPTED_STATUSES,
          appMessages.attributes.accepted,
          false // defaultValue
        ),
        hasResponse && getMarkdownField(entity, 'response', true),
      ],
    });
    // indicators
    if (indicators) {
      fields.push({
        label: appMessages.nav.indicatorsSuper,
        icon: 'indicators',
        fields: [
          getIndicatorConnectionField(
            indicators,
            indicatorConnections,
            onEntityClick,
          ),
        ],
      });
    }
    // measures
    if (measures) {
      fields.push({
        label: appMessages.nav.measuresSuper,
        icon: 'measures',
        fields: [
          getMeasureConnectionField(
            measures,
            measureTaxonomies,
            measureConnections,
            onEntityClick,
          ),
        ],
      });
    }
    return fields;
  };

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    hasTaxonomyCategories(taxonomies)
      ? { // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      }
      : null,
  ]);

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isManager,
      measures,
      taxonomies,
      measureTaxonomies,
      measureConnections,
      indicators,
      indicatorConnections,
      onEntityClick,
      frameworks,
    } = this.props;
    const frameworkId = viewEntity && viewEntity.getIn(['attributes', 'framework_id']);
    const type = intl.formatMessage(
      appMessages.entities[frameworkId ? `recommendations_${frameworkId}` : 'recommendations'].single
    );

    const currentFramework = dataReady
      && (
        frameworks.find(
          (fw) => qe(fw.get('id'), frameworkId)
        )
        || frameworks.first()
      );
    const hasResponse = dataReady
      && currentFramework
      && currentFramework.getIn(['attributes', 'has_response']);
    const hasMeasures = dataReady
      && currentFramework
      && currentFramework.getIn(['attributes', 'has_measures']);
    const hasIndicators = dataReady
      && currentFramework
      && currentFramework.getIn(['attributes', 'has_indicators']);
    let buttons = [];
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
      buttons = isManager
        ? buttons.concat([
          {
            type: 'edit',
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
          {
            type: 'close',
            onClick: this.props.handleClose,
          },
        ])
        : buttons.concat([{
          type: 'close',
          onClick: this.props.handleClose,
        }]);
    }
    const pageTitle = intl.formatMessage(messages.pageTitle, { type });
    const metaTitle = viewEntity
      ? `${pageTitle} ${getEntityReference(viewEntity)}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle} ${this.props.params.id}`;

    return (
      <div>
        <Helmet
          title={metaTitle}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon={frameworkId ? `recommendations_${frameworkId}` : 'recommendations'}
            buttons={buttons}
          />
          { !dataReady
            && <Loading />
          }
          { !viewEntity && dataReady
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isManager),
                    aside: isManager && this.getHeaderAsideFields(viewEntity, isManager),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      hasMeasures && measures,
                      measureTaxonomies,
                      measureConnections,
                      hasIndicators && indicators,
                      indicatorConnections,
                      onEntityClick,
                      hasResponse,
                    ),
                    aside: this.getBodyAsideFields(taxonomies),
                  },
                }}
              />
            )
          }
        </Content>
      </div>
    );
  }
}

RecommendationView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onEntityClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  measureTaxonomies: PropTypes.object,
  measureConnections: PropTypes.object,
  measures: PropTypes.object,
  indicators: PropTypes.object,
  indicatorConnections: PropTypes.object,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  frameworks: PropTypes.object,
};

RecommendationView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  measureTaxonomies: selectMeasureTaxonomies(state),
  measureConnections: selectMeasureConnections(state),
  indicators: selectIndicators(state, props.params.id),
  indicatorConnections: selectIndicatorConnections(state),
  frameworks: selectActiveFrameworks(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`${PATHS.RECOMMENDATIONS}${PATHS.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(PATHS.RECOMMENDATIONS));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationView);
