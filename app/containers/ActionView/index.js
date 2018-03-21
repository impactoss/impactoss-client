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

import { getFields } from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { MEASURE_SHAPE, USER_ROLES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectHasUserRole,
  selectRecommendationTaxonomies,
  selectSdgTargetTaxonomies,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectIndicatorConnections,
} from 'containers/App/selectors';

import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectRecommendations,
  selectIndicators,
  selectSdgTargets,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
    const {
      viewEntity,
      dataReady,
      hasUserRole,
      recommendations,
      indicators,
      taxonomies,
      recTaxonomies,
      sdgtargets,
      sdgtargetTaxonomies,
      onEntityClick,
      recConnections,
      sdgtargetConnections,
      indicatorConnections,
    } = this.props;

    const buttons = hasUserRole[USER_ROLES.ADMIN.value]
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
            icon="measures"
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
              fields={getFields({
                entity: viewEntity,
                hasUserRole,
                associations: {
                  taxonomies,
                  recommendations,
                  recTaxonomies,
                  recConnections,
                  indicators,
                  indicatorConnections,
                  sdgtargets,
                  sdgtargetTaxonomies,
                  sdgtargetConnections,
                },
                onEntityClick,
                shape: MEASURE_SHAPE,
                contextIntl: this.context.intl,
              })}
            />
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
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
  sdgtargetTaxonomies: PropTypes.object,
  recConnections: PropTypes.object,
  sdgtargetConnections: PropTypes.object,
  indicatorConnections: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  hasUserRole: selectHasUserRole(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
  recTaxonomies: selectRecommendationTaxonomies(state),
  sdgtargetTaxonomies: selectSdgTargetTaxonomies(state),
  recConnections: selectRecommendationConnections(state),
  sdgtargetConnections: selectSdgTargetConnections(state),
  indicatorConnections: selectIndicatorConnections(state),
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
