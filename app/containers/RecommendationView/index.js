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
  getTaxonomyFields,
  hasTaxonomyCategories,
} from 'utils/fields';

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
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectMeasures,
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
        getReferenceField(entity, isManager),
        getTitleTextField(entity, isManager),
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


  getBodyMainFields = (entity, measures, measureTaxonomies, measureConnections, onEntityClick) => ([
    {
      fields: [
        getStatusField(entity, 'accepted', ACCEPTED_STATUSES, appMessages.attributes.accepted),
        getMarkdownField(entity, 'response', true, appMessages),
      ],
    },
    {
      label: appMessages.entities.connections.plural,
      icon: 'connections',
      fields: [
        getMeasureConnectionField(measures, measureTaxonomies, measureConnections, appMessages, onEntityClick),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    hasTaxonomyCategories(taxonomies)
    ? { // fieldGroup
      label: appMessages.entities.taxonomies.plural,
      icon: 'categories',
      fields: getTaxonomyFields(taxonomies, appMessages),
    }
    : null,
  ]);

  render() {
    const { viewEntity, dataReady, isManager, measures, taxonomies, measureTaxonomies, measureConnections, onEntityClick } = this.props;
    const buttons = isManager
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
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="recommendations"
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
                  main: this.getHeaderMainFields(viewEntity, isManager),
                  aside: isManager && this.getHeaderAsideFields(viewEntity, isManager),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity, measures, measureTaxonomies, measureConnections, onEntityClick),
                  aside: this.getBodyAsideFields(taxonomies),
                },
              }}
            />
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
  params: PropTypes.object,
  isManager: PropTypes.bool,
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
