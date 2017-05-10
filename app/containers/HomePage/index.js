/*
 * HomePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { mapToTaxonomyList } from 'utils/taxonomies';

import {
  getEntities,
  isReady,
} from 'containers/App/selectors';
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import Button from 'components/buttons/Button';
import ButtonHero from 'components/buttons/ButtonHero';
import Section from 'components/basic/Section';
import Container from 'components/basic/Container';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import TaxonomyList from 'components/TaxonomyList';
import NormalImg from 'components/Img';
import Footer from 'components/Footer';

import appMessages from 'containers/App/messages';
import messages from './messages';

import graphicHome from './graphicHome.png';

const GraphicHome = styled(NormalImg)`
  width: 100%;
  margin-bottom: -2em;
`;

const SectionTop = styled(Section)`
  text-align: center;
  min-height: 100vH;
  margin-top: -115px;
  padding-top: 130px;
`;
const ButtonIconOnly = styled(Button)`
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;
const ButtonIconWrap = styled.div`
padding-top: 2em;
`;
const ButtonIconAbove = styled(Button)`
  color: ${palette('primary', 4)};
  &:hover {
    color: ${palette('primary', 4)};
    opacity: 0.95;
  }
`;
const ButtonIconAboveMore = styled(Button)`
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
  min-width: 200px;
  margin: 0 30px;
`;
const ButtonIconAboveWrap = styled.div`
  padding-top: 1em;
  text-align: center;
  font-size: 1.7em;
`;
const SectionCategories = styled(Section)`
  padding-bottom: 8em;
`;
const SectionAction = styled(Section)`
  color: ${palette('primary', 4)};
  background-color: ${palette('primary', 0)};
`;
const SectionMore = styled(Section)`
  color: ${palette('greyscaleDark', 3)};
  background-color: ${palette('primary', 4)};
`;
// text-align: center;
const SectionTitle = styled.h2`
  margin-bottom: 1em;
`;
const SectionLead = styled.p`
  font-size: 1.25em;
`;
const TaxonomySlider = styled.div`
  min-height: 6em;
  padding-top: 2em;
`;
const TopActions = styled.div`
  padding-top: 2em;
`;
const Title = styled.h1`
  color:${palette('primary', 0)}
  font-family: ${(props) => props.theme.fonts.secondary};
  text-transform: uppercase;
  margin-bottom:0;
  font-size: 2.8em
`;

const Claim = styled.p`
  color: ${palette('secondary', 0)};
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: 1.25em;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
`;

const Intro = styled.p`
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: 1.25em;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  preparePageMenuPages = (pages) =>
    Object.values(pages).map((page) => ({
      path: `/pages/${page.id}`,
      title: page.attributes.menu_title || page.attributes.title,
    }));

  // scrollToSection = (section) => {
  scrollToSection = () => {
    // TODO in page scroll
    // console.log('scrollToSection', section)
  }


  render() {
    const { dataReady, onPageLink, pages, taxonomies } = this.props;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop dark>
          <GraphicHome src={graphicHome} alt={this.context.intl.formatMessage(messages.pageTitle)} />
          <Title>
            <FormattedMessage {...appMessages.app.title} />
          </Title>
          <Claim>
            <FormattedMessage {...appMessages.app.claim} />
          </Claim>
          <Intro>
            <FormattedMessage {...messages.intro} />
          </Intro>
          <TopActions>
            <div>
              <ButtonHero onClick={() => this.scrollToSection('categories')}>
                <FormattedMessage {...messages.explore} />
              </ButtonHero>
            </div>
            <ButtonIconWrap>
              <ButtonIconOnly onClick={() => this.scrollToSection('categories')}>
                <Icon name="arrowDown" size={'2.5em'} />
              </ButtonIconOnly>
            </ButtonIconWrap>
          </TopActions>
        </SectionTop>
        <SectionCategories>
          <Container>
            <SectionTitle>
              <FormattedMessage {...messages.exploreCategories} />
            </SectionTitle>
            <SectionLead>
              <FormattedMessage {...messages.exploreCategoriesLead} />
            </SectionLead>
            <TaxonomySlider>
              { !dataReady &&
                <Loading />
              }
              { dataReady &&
                <TaxonomyList
                  taxonomies={mapToTaxonomyList(taxonomies, onPageLink)}
                />
              }
            </TaxonomySlider>
          </Container>
        </SectionCategories>
        <SectionAction>
          <Container>
            <SectionTitle>
              <FormattedMessage {...messages.exploreActions} />
            </SectionTitle>
            <SectionLead>
              <FormattedMessage {...messages.exploreActionsLead} />
            </SectionLead>
            <ButtonIconAboveWrap>
              <ButtonIconAbove onClick={() => onPageLink('/actions')}>
                <div>
                  <Icon name="actions" size={'4em'} />
                </div>
                <div>
                  <FormattedMessage {...messages.exploreActionsLink} />
                </div>
              </ButtonIconAbove>
            </ButtonIconAboveWrap>
          </Container>
        </SectionAction>
        <SectionMore>
          <Container>
            <SectionTitle>
              <FormattedMessage {...messages.exploreMore} />
            </SectionTitle>
            <SectionLead>
              <FormattedMessage {...messages.exploreMoreLead} />
            </SectionLead>
            <ButtonIconAboveWrap>
              <ButtonIconAboveMore onClick={() => onPageLink('/recommendations')}>
                <div>
                  <Icon name="recommendations" size={'3.5em'} />
                </div>
                <div>
                  <FormattedMessage {...appMessages.entities.recommendations.plural} />
                </div>
              </ButtonIconAboveMore>
              <ButtonIconAboveMore onClick={() => onPageLink('/indicators')}>
                <div>
                  <Icon name="indicators" size={'3.5em'} />
                </div>
                <div>
                  <FormattedMessage {...appMessages.entities.indicators.plural} />
                </div>
              </ButtonIconAboveMore>
            </ButtonIconAboveWrap>
          </Container>
        </SectionMore>
        <Footer
          pages={pages && this.preparePageMenuPages(pages)}
          onPageLink={onPageLink}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool.isRequired,
  pages: PropTypes.object,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'taxonomies',
    'categories',
    'pages',
  ] }),
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      extend: {
        type: 'count',
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        as: 'count',
      },
      out: 'js',
    },
  ),
  pages: getEntities(
    state,
    {
      path: 'pages',
      where: { draft: false },
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('pages'));
      // kick off loading although not needed
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('roles'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
