/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled, { withTheme } from 'styled-components';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectFWTaxonomiesSorted,
  selectReady,
  selectActiveFrameworks,
  selectFrameworkQuery,
} from 'containers/App/selectors';
import { PATHS, CONTENT_LIST } from 'containers/App/constants';

// components
import Button from 'components/buttons/Button';
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Icon from 'components/Icon';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';

import { qe } from 'utils/quasi-equals';
import isNumber from 'utils/is-number';

// relative
import appMessages from 'containers/App/messages';
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

const Content = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 1em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 2em;
  }
`;
const Description = styled.p`
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
const Diagram = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-bottom: 180px;
  }
`;

const DiagramSectionVertical = styled.div`
  display: block;
  position: relative;
  border-top: 1px dashed ${palette('light', 4)};
`;

const DiagramSectionVerticalCenter = styled.div`
  text-align: center;
  display: block;
  margin: 0 auto;
  position: relative;
`;

const DiagramButtonWrap = styled.div`
  position: relative;
  display: inline-block;
  padding: 20px 0;
  vertical-align: bottom;
  margin: ${({ multiple }) => multiple ? '30px 2px' : '30px 0'};
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin: ${({ multiple }) => multiple ? '30px 5px' : '30px 0'};
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  @media print {
    margin: 15px 5px;
    padding: 0;
  }
`;

const DiagramButton = styled(Button)`
  background-color: ${(props) => palette(props.paletteDefault, 0)};
  color: ${palette('primary', 1)};
  padding: ${({ draft }) => draft ? '0.4em 0.5em 0.75em' : '0.6em 0.5em'};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
  font-size: 0.7em;
  border-radius: 15px;
  max-width: ${({ multiple }) => multiple ? '70px' : 'none'};
  min-width: none;
  &:hover {
    background-color: ${(props) => palette(props.paletteHover, 0)};
  }
  color: ${palette('primary', 4)};
  padding: ${({ draft }) => draft ? '0.4em 0.5em 0.75em' : '0.6em 0.5em'};
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  font-size: 0.8em;
  border-radius: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1em;
    padding: ${({ draft }) => draft ? '0.4em 0.5em 0.4em' : '0.6em 0.5em'};
    max-width: ${({ multiple }) => multiple ? '100px' : 'none'};
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1.1em;
    min-width: ${({ multiple }) => multiple ? 'none' : '180px'};
    padding: ${({ draft }) => draft ? '0.4em 0.5em 1em' : '0.6em 0.5em'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-weight: bold;
    max-width: none;
    padding: ${({ draft }) => draft ? '0.6em 1em 0.2em' : '0.8em 1em'};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
    box-shadow: none;
    border: 1px solid ${palette('light', 3)};
    min-width: none;
    width: 130px;
    height: 90px;
  }
`;
const DiagramButtonIcon = styled.div`
  padding-bottom: 5px;
`;

const DraftEntities = styled.div`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
    font-size: 0.8em;
    font-weight: normal;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

const DiagramSvg = styled.svg``;
const DiagramSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @media print {
    display: none;
  }
`;

const PathLineCustom = styled(PathLine)`
  stroke: ${palette('dark', 2)};
  stroke-width: 0.5px;
  fill: none;
`;
const PathLineArrow = styled(PathLine)`
  fill: ${palette('dark', 2)};
`;
const SectionLabel = styled.div`
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes.text.small};
  margin-top: 5px;
  position: absolute;
  left: 0;
  top: 0;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
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

  getTaxonomiesByTagging = (taxonomies, tags) => taxonomies.filter((tax, key, list) => {
    if (tax.getIn(['attributes', tags])) {
      return true;
    }
    const childTaxonomies = list.filter((item) => qe(item.getIn(['attributes', 'parent_id']), tax.get('id')));
    return childTaxonomies.some((child) => child.getIn(['attributes', tags]));
  })

  getConnectionPoint = (node, nodeReference, side = 'bottom') => {
    const boundingRect = node.getBoundingClientRect();
    const boundingRectReference = nodeReference.getBoundingClientRect();

    if (side === 'right' || side === 'left') {
      return ({
        x: side === 'right'
          ? (boundingRect.right - boundingRectReference.left)
          : (boundingRect.left - boundingRectReference.left),
        y: (boundingRect.top - boundingRectReference.top)
          + (((boundingRect.bottom - boundingRectReference.top) - (boundingRect.top - boundingRectReference.top)) / 2),
      });
    }
    return ({
      x: (boundingRect.left - boundingRectReference.left)
        + (((boundingRect.right - boundingRectReference.left) - (boundingRect.left - boundingRectReference.left)) / 2),
      y: side === 'bottom'
        ? (boundingRect.bottom - boundingRectReference.top)
        : (boundingRect.top - boundingRectReference.top),
    });
  }

  getConnectionPath = (start, end) => [
    { x: start.x, y: start.y + 5 },
    { x: end.x, y: end.y - 5 },
  ];

  getCurvedConnectionPath = (direction = 'vertical', start, end, curve = 0.2) => {
    if (direction === 'right') {
      return [
        { x: start.x + 5, y: start.y },
        { x: Math.max(start.x, end.x) + 25, y: start.y },
        { x: Math.max(start.x, end.x) + 25, y: end.y },
        { x: end.x + 5, y: end.y },
      ];
    }
    return [
      { x: start.x, y: start.y + 5 },
      { x: start.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: end.y - 5 },
    ];
  }

  getConnectionPathArrow = (connectionPath, direction = 'bottom') => {
    const point = connectionPath[connectionPath.length - 1];
    if (direction === 'left') {
      return [
        point,
        { x: point.x + 5, y: point.y + 5 },
        { x: point.x + 5, y: point.y - 5 },
        point,
      ];
    }
    return [
      point,
      { x: point.x - 5, y: point.y - 5 },
      { x: point.x + 5, y: point.y - 5 },
      point,
    ];
  }

  connectRecommendationsMeasures = (fwId) => this.getCurvedConnectionPath(
    'vertical',
    this.getConnectionPoint(this.state[`buttonRecs_${fwId}`], this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'top'),
    0.25,
  );

  connectRecommendationsIndicators = (direction = 'vertical', fwId) => this.getCurvedConnectionPath(
    direction,
    this.getConnectionPoint(
      this.state[`buttonRecs_${fwId}`],
      this.state.diagram,
      direction === 'vertical' ? 'bottom' : direction,
    ),
    this.getConnectionPoint(
      this.state.buttonIndicators,
      this.state.diagram,
      direction === 'vertical' ? 'top' : direction,
    ),
    0.9, // curve
  );

  connectMeasuresIndicators = () => this.getConnectionPath(
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'top'),
  );

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  renderPathsSVG = (frameworks) => {
    const radius = 15;
    return (
      <DiagramSvgWrapper>
        {this.state.diagram && (
          <DiagramSvg
            width={this.state.diagram.getBoundingClientRect().width}
            height={this.state.diagram.getBoundingClientRect().height}
          >
            {frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return fw.getIn(['attributes', 'has_indicators'])
                && this.state[`buttonRecs_${fwId}`]
                && this.state.buttonIndicators
                && (
                  <PathLineCustom
                    key={fwId}
                    r={radius}
                    strokeDasharray="5,5"
                    points={this.connectRecommendationsIndicators(
                      frameworks.size === 1 ? 'right' : 'vertical',
                      fwId,
                    )}
                  />
                );
            })}
            {frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return fw.getIn(['attributes', 'has_indicators'])
                && this.state[`buttonRecs_${fwId}`]
                && this.state.buttonIndicators
                && frameworks.size === 1
                && (
                  <PathLineArrow
                    key={fwId}
                    r={0}
                    points={
                      this.getConnectionPathArrow(
                        this.connectRecommendationsIndicators(
                          'right',
                          fwId,
                        ),
                        'left'
                      )
                    }
                  />
                );
            })}
            {frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return this.state[`buttonRecs_${fwId}`]
                && this.state.buttonMeasures
                && (
                  <PathLineCustom
                    key={fwId}
                    r={frameworks.size > 1 ? radius : 0}
                    points={this.connectRecommendationsMeasures(fwId)}
                  />
                );
            })}
            {frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return fw.getIn(['attributes', 'has_measures'])
                && this.state[`buttonRecs_${fwId}`]
                && this.state.buttonMeasures
                && (
                  <PathLineArrow
                    key={fwId}
                    r={0}
                    points={
                      this.getConnectionPathArrow(
                        this.connectRecommendationsMeasures(fwId)
                      )
                    }
                  />
                );
            })}
            { this.state.buttonIndicators && this.state.buttonMeasures && (
              <PathLineCustom
                r={0}
                points={this.connectMeasuresIndicators()}
              />
            )}
            { this.state.buttonIndicators && this.state.buttonMeasures && (
              <PathLineArrow
                r={0}
                points={
                  this.getConnectionPathArrow(
                    this.connectMeasuresIndicators()
                  )
                }
              />
            )}
          </DiagramSvg>
        )}
      </DiagramSvgWrapper>
    );
  }

  renderButton = ({
    path,
    query,
    paletteDefault,
    paletteHover,
    icon,
    type,
    count,
    draftCount,
    stateButton,
    multiple,
  }) => {
    const { intl } = this.context;
    return (
      <DiagramButton
        onClick={() => this.props.onPageLink(path, query)}
        paletteDefault={paletteDefault}
        paletteHover={paletteHover}
        ref={(node) => {
          if (!this.state[stateButton]) {
            this.setState({ [stateButton]: node });
          }
        }}
        draft={draftCount > 0}
        multiple={multiple}
      >
        <DiagramButtonIcon>
          <Icon
            name={icon}
            sizes={{
              mobile: '24px',
              small: '24px',
              medium: '24px',
              large: '24px',
            }}
          />
        </DiagramButtonIcon>
        <div>
          {`${count || 0} ${intl.formatMessage(appMessages.entities[type][count !== 1 ? 'plural' : 'single'])}`}
        </div>
        { draftCount > 0
          && (
            <DraftEntities>
              <FormattedMessage {...messages.buttons.draft} values={{ count: draftCount }} />
            </DraftEntities>
          )
        }
      </DiagramButton>
    );
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

    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.supTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        {!dataReady && <EntityListSidebarLoading responsiveSmall />}
        {dataReady && (
          <TaxonomySidebar
            taxonomies={taxonomies}
            frameworkId={frameworkId}
            frameworks={frameworks}
            onTaxonomyLink={onTaxonomyLink}
          />
        )}
        <ContainerWithSidebar sidebarResponsiveSmall>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={intl.formatMessage(messages.supTitle)}
                title={intl.formatMessage(messages.title)}
              />
              <Description>
                <FormattedMessage {...messages.description} />
              </Description>
              {!dataReady && <Loading />}
              {dataReady && (
                <Diagram
                  ref={(node) => {
                    if (!this.state.diagram) {
                      this.setState({ diagram: node });
                    }
                  }}
                >
                  { this.renderPathsSVG(frameworks) }
                  <div>
                    <DiagramSectionVertical>
                      <SectionLabel>
                        <FormattedMessage {...appMessages.nav.recommendationsSuper} />
                      </SectionLabel>
                      <DiagramSectionVerticalCenter>
                        {frameworks && frameworks.valueSeq().map(
                          (fw) => {
                            const fwId = isNumber(fw.get('id')) ? parseInt(fw.get('id'), 10) : fw.get('id');
                            return (
                              <DiagramButtonWrap key={fwId} multiple={frameworks.size > 1}>
                                {this.renderButton({
                                  path: PATHS.RECOMMENDATIONS,
                                  query: frameworks.size > 1 && {
                                    arg: 'fwx',
                                    value: fwId,
                                    replace: true,
                                  },
                                  paletteDefault: 'recommendations',
                                  paletteHover: 'recommendationsHover',
                                  stateButton: `buttonRecs_${fwId}`,
                                  icon: `recommendations_${fwId}`,
                                  type: `recommendations_${fwId}`,
                                  count: this.props.recommendationCountByFw.get(fwId),
                                  draftCount: this.props.recommendationDraftCountByFw.get(fwId),
                                  multiple: frameworks.size > 1,
                                })}
                              </DiagramButtonWrap>
                            );
                          }
                        )}
                      </DiagramSectionVerticalCenter>
                    </DiagramSectionVertical>
                    <DiagramSectionVertical>
                      <SectionLabel>
                        <FormattedMessage {...appMessages.nav.measuresSuper} />
                      </SectionLabel>
                      <DiagramSectionVerticalCenter>
                        <DiagramButtonWrap>
                          {this.renderButton({
                            path: PATHS.MEASURES,
                            paletteDefault: 'measures',
                            paletteHover: 'measuresHover',
                            stateButton: 'buttonMeasures',
                            icon: 'measures',
                            type: 'measures',
                            count: this.props.measureCount,
                            draftCount: this.props.measureDraftCount,
                          })}
                        </DiagramButtonWrap>
                      </DiagramSectionVerticalCenter>
                    </DiagramSectionVertical>
                    <DiagramSectionVertical>
                      <SectionLabel>
                        <FormattedMessage {...appMessages.nav.indicatorsSuper} />
                      </SectionLabel>
                      <DiagramSectionVerticalCenter>
                        <DiagramButtonWrap>
                          {this.renderButton({
                            path: PATHS.INDICATORS,
                            paletteDefault: 'indicators',
                            paletteHover: 'indicatorsHover',
                            stateButton: 'buttonIndicators',
                            icon: 'indicators',
                            type: 'indicators',
                            count: this.props.indicatorCount,
                            draftCount: this.props.indicatorDraftCount,
                          })}
                        </DiagramButtonWrap>
                      </DiagramSectionVerticalCenter>
                    </DiagramSectionVertical>
                  </div>
                </Diagram>
              )}
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}
// <AnnotationVertical>
//   {`${recommendationAddressedCount} ${intl.formatMessage(messages.diagram.addressed)}`}
// </AnnotationVertical>
// <AnnotationVertical>
//   <FormattedMessage {...messages.diagram.measured} />
// </AnnotationVertical>

Overview.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  onTaxonomyLink: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  recommendationCountByFw: PropTypes.object,
  measureCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCountByFw: PropTypes.object,
  measureDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  theme: PropTypes.object,
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
  frameworkId: selectFrameworkQuery(state),
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
