/*
 *
 * ActionView
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
  getRecommendationConnectionField,
  getIndicatorConnectionField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getDateField,
  getTextField,
  getIdField,
} from 'utils/fields';

import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, getEntityReference } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectHasUserRole,
  selectRecommendationTaxonomies,
  selectRecommendationConnections,
  selectIndicatorConnections,
  selectActiveFrameworks,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectRecommendations,
  selectIndicators,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
        getIdField(entity, isManager),
        getTitleField(entity, isManager),
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
    indicators,
    indicatorConnections,
    recommendationsByFw,
    recommendationTaxonomies,
    recommendationConnections,
    frameworks,
    onEntityClick,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true),
        // getMarkdownField(entity, 'outcome', true),
        // getMarkdownField(entity, 'indicator_summary', true),
      ],
    });
    // indicators
    if (indicators) {
      fields.push({
        label: appMessages.nav.indicatorsSuper,
        icon: 'indicators',
        fields: [
          getIndicatorConnectionField(indicators, indicatorConnections, onEntityClick),
        ],
      });
    }
    // recs
    if (recommendationsByFw) {
      const recConnections = [];
      recommendationsByFw.forEach((recs, fwid) => {
        const framework = frameworks.find((fw) => qe(fw.get('id'), fwid));
        const hasResponse = framework && framework.getIn(['attributes', 'has_response']);
        recConnections.push(
          getRecommendationConnectionField(
            recs,
            recommendationTaxonomies,
            recommendationConnections,
            onEntityClick,
            fwid,
            hasResponse,
          ),
        );
      });
      fields.push({
        label: appMessages.nav.recommendationsSuper,
        icon: 'recommendations',
        fields: recConnections,
      });
    }
    return fields;
  };

  getBodyAsideFields = (viewEntity, taxonomies) => {
    const fields = [];
    fields.push({
      type: 'dark',
      fields: [
        getDateField(viewEntity, 'target_date', true),
        getTextField(viewEntity, 'target_date_comment'),
      ],
    });
    if (hasTaxonomyCategories(taxonomies)) {
      fields.push({ // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      });
    }
    return fields;
  };

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      hasUserRole,
      recommendationsByFw,
      indicators,
      taxonomies,
      recTaxonomies,
      onEntityClick,
      recConnections,
      indicatorConnections,
      frameworks,
    } = this.props;
    const isManager = hasUserRole[USER_ROLES.MANAGER.value];
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
    const pageTitle = intl.formatMessage(messages.pageTitle);
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
            icon="measures"
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
                    aside: isManager && this.getHeaderAsideFields(viewEntity),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      indicators,
                      indicatorConnections,
                      recommendationsByFw,
                      recTaxonomies,
                      recConnections,
                      frameworks,
                      onEntityClick,
                    ),
                    aside: this.getBodyAsideFields(
                      viewEntity,
                      taxonomies,
                    ),
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

ActionView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  hasUserRole: PropTypes.object,
  taxonomies: PropTypes.object,
  recTaxonomies: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  indicators: PropTypes.object,
  recConnections: PropTypes.object,
  indicatorConnections: PropTypes.object,
  params: PropTypes.object,
  frameworks: PropTypes.object,
};

ActionView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  hasUserRole: selectHasUserRole(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  recommendationsByFw: selectRecommendations(state, props.params.id),
  recTaxonomies: selectRecommendationTaxonomies(state),
  recConnections: selectRecommendationConnections(state),
  indicatorConnections: selectIndicatorConnections(state),
  frameworks: selectActiveFrameworks(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (measureId) => {
      dispatch(updatePath(`${PATHS.MEASURES}${PATHS.EDIT}/${measureId}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(PATHS.MEASURES));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);
