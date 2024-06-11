/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';

import styled, { withTheme } from 'styled-components';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectFWTaxonomiesSorted,
  selectReady,
  selectActiveFrameworks,
  selectCurrentFrameworkId,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
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
const Description = styled.div`
  margin-bottom: 1.5em;
  font-size: 1em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 2em;
    font-size: 1.1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
const TextBelow = styled.div`
  margin-top: 1.5em;
  font-size: 0.9em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
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
    const { intl } = this.context;
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
      frameworks,
      frameworkId,
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
                <ReactMarkdown source={intl.formatMessage(messages.description)} />
              </Description>
              <SkipContent
                href="#sidebar-taxonomy-options"
                title={this.context.intl.formatMessage(appMessages.screenreader.skipToCategorySelect)}
              >
                <FormattedMessage {...appMessages.screenreader.skipToCategorySelect} />
              </SkipContent>
            </div>
            {!dataReady && <Loading />}
            {dataReady && frameworks.size > 1 && (
              <VerticalDiagram
                frameworks={frameworks}
                onPageLink={this.props.onPageLink}
                recommendationCountByFw={this.props.recommendationCountByFw}
                recommendationDraftCountByFw={this.props.recommendationDraftCountByFw}
                measureCount={this.props.measureCount}
                measureDraftCount={this.props.measureDraftCount}
                indicatorCount={this.props.indicatorCount}
                indicatorDraftCount={this.props.indicatorDraftCount}
              />
            )}
            {dataReady && frameworks.size === 1 && (
              <HorizontalDiagram
                onPageLink={this.props.onPageLink}
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
            {dataReady && messages.textBelow && intl.formatMessage(messages.textBelow) !== '' && (
              <TextBelow>
                <ReactMarkdown
                  source={intl.formatMessage(messages.textBelow)}
                  linkTarget="_blank"
                  className="react-markdown"
                />
              </TextBelow>
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
  frameworkId: PropTypes.string,
};

Overview.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectFWTaxonomiesSorted(state),
  frameworks: selectActiveFrameworks(state),
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

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Overview));
