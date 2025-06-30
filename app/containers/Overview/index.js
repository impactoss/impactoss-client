/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';

import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectFWTaxonomiesSorted,
  selectReady,
  selectFrameworks,
  selectActiveFrameworks,
  selectCurrentFrameworkId,
} from 'containers/App/selectors';
import { ABOUT_PAGE_ID } from 'themes/config';
import { ROUTES, CONTENT_LIST } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import Footer from 'containers/Footer';
// components
import ContainerWrapperSidebar from 'components/styled/Container/ContainerWrapperSidebar';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';
import SkipContent from 'components/styled/SkipContent';
import A from 'components/styled/A';
import Description from 'components/styled/Description';

// relative
import VerticalDiagram from './VerticalDiagram';
import HorizontalDiagram from './HorizontalDiagram';
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectRecommendationCount,
  selectIndicatorCount,
  selectMeasureCount,
  selectRecommendationDraftCount,
  selectIndicatorDraftCount,
  selectMeasureDraftCount,
} from './selectors';

const ViewContainer = styled(Container)`
  min-height: 66vH;
`;

const AboutLink = styled(A)`
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
    text-decoration: underline;
  }
`;

const STATE_INITIAL = {
  diagram: null,
  buttonRecs_1: null,
  buttonRecs_2: null,
  buttonRecs_3: null,
  buttonRecs_4: null,
  buttonRecs_5: null,
  buttonMeasures: null,
  buttonIndicators: null,
  mouseOverTaxonomy: null,
  mouseOverTaxonomyDiagram: null,
};

export class Overview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = STATE_INITIAL;
  }

  // make sure to load all data from server
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onTaxonomyIconMouseOver = (taxonomyId, isOver = true) => {
    this.setState({
      mouseOverTaxonomyDiagram: isOver ? taxonomyId : null,
    });
  };

  onTaxonomyMouseOver = (taxonomyId, isOver = true) => {
    this.setState({
      mouseOverTaxonomy: isOver ? taxonomyId : null,
    });
  };

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  render() {
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
      frameworks,
      allFrameworks,
      frameworkId,
      onPageLink,
      intl,
    } = this.props;
    let recommendationCount = 1;
    let recommendationDraftCount = 0;
    if (frameworks && frameworks.size === 1) {
      recommendationCount = this.props.recommendationCountByFw.first();
      recommendationDraftCount = this.props.recommendationDraftCountByFw.first();
    }

    return (
      <div>
        <HelmetCanonical
          title={intl.formatMessage(messages.supTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <ContainerWrapperSidebar sidebarResponsiveSmall>
          <ViewContainer>
            <ContentHeader
              type={CONTENT_LIST}
              supTitle={intl.formatMessage(messages.supTitle)}
              title={intl.formatMessage(messages.title)}
            />
            <div style={{ position: 'relative' }}>
              <Description>
                <FormattedMessage
                  {...messages.description}
                  values={{
                    moreLink: (
                      <AboutLink
                        href={`${ROUTES.PAGES}/${ABOUT_PAGE_ID}`}
                        onClick={(evt) => {
                          if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                          onPageLink(`${ROUTES.PAGES}/${ABOUT_PAGE_ID}`);
                        }}
                      >
                        <FormattedMessage {...messages.moreLink} />
                      </AboutLink>
                    ),
                  }}
                />
              </Description>
              <SkipContent
                href="#sidebar-taxonomy-options"
                title={intl.formatMessage(appMessages.screenreader.skipToCategorySelect)}
              >
                <FormattedMessage {...appMessages.screenreader.skipToCategorySelect} />
              </SkipContent>
            </div>
            {!dataReady && <Loading />}
            {dataReady && allFrameworks.size > 1 && (
              <VerticalDiagram
                frameworks={frameworks}
                onPageLink={onPageLink}
                recommendationCountByFw={this.props.recommendationCountByFw}
                recommendationDraftCountByFw={this.props.recommendationDraftCountByFw}
                measureCount={this.props.measureCount}
                measureDraftCount={this.props.measureDraftCount}
                indicatorCount={this.props.indicatorCount}
                indicatorDraftCount={this.props.indicatorDraftCount}
              />
            )}
            {dataReady && allFrameworks.size === 1 && (
              <HorizontalDiagram
                onPageLink={onPageLink}
                onTaxonomyIconMouseOver={this.onTaxonomyIconMouseOver}
                measureCount={this.props.measureCount}
                measureDraftCount={this.props.measureDraftCount}
                indicatorCount={this.props.indicatorCount}
                indicatorDraftCount={this.props.indicatorDraftCount}
                taxonomies={taxonomies}
                recommendationCount={recommendationCount}
                recommendationDraftCount={recommendationDraftCount}
                frameworkId={frameworks.first().get('id')}
                mouseOverTaxonomy={this.state.mouseOverTaxonomy}
              />
            )}
          </ViewContainer>
          <Footer hasBorder />
        </ContainerWrapperSidebar>
        {!dataReady && <EntityListSidebarLoading responsiveSmall />}
        {dataReady && (
          <TaxonomySidebar
            taxonomies={taxonomies}
            frameworkId={frameworkId}
            frameworks={frameworks}
            onTaxonomyLink={onTaxonomyLink}
            onTaxonomyOver={this.onTaxonomyMouseOver}
            active={this.state.mouseOverTaxonomyDiagram}
          />
        )}
      </div>
    );
  }
}

Overview.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  dataReady: PropTypes.bool,
  theme: PropTypes.object,
  onPageLink: PropTypes.func,
  onTaxonomyLink: PropTypes.func,
  taxonomies: PropTypes.object,
  recommendationCountByFw: PropTypes.object,
  measureCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCountByFw: PropTypes.object,
  measureDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  frameworks: PropTypes.object,
  allFrameworks: PropTypes.object,
  frameworkId: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectFWTaxonomiesSorted(state),
  frameworks: selectActiveFrameworks(state),
  allFrameworks: selectFrameworks(state),
  frameworkId: selectCurrentFrameworkId(state),
  recommendationCountByFw: selectRecommendationCount(state),
  measureCount: selectMeasureCount(state),
  indicatorCount: selectIndicatorCount(state),
  recommendationDraftCountByFw: selectRecommendationDraftCount(state),
  measureDraftCount: selectMeasureDraftCount(state),
  indicatorDraftCount: selectIndicatorDraftCount(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path, query) => {
      dispatch(updatePath(
        path,
        {
          query,
        }
      ));
    },
    onTaxonomyLink: (path) => {
      dispatch(updatePath(path, { keepQuery: true }));
    },
  };
}

export default injectIntl(withTheme(connect(mapStateToProps, mapDispatchToProps)(Overview)));
