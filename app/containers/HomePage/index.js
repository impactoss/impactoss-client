/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { mapToTaxonomyList } from 'utils/taxonomies';

import {
  selectReady,
  selectEntities,
  selectEntitiesWhere,
} from 'containers/App/selectors';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { scrollToComponent } from 'utils/scroll-to-component';

import Button from 'components/buttons/Button';
import ButtonHero from 'components/buttons/ButtonHero';
import Section from 'components/styled/Section';
import Container from 'components/styled/Container';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import TaxonomyList from 'components/TaxonomyList';
// import NormalImg from 'components/Img';
import Footer from 'components/Footer';

import appMessages from 'containers/App/messages';
import { DB_TABLES } from 'containers/App/constants';
import messages from './messages';
import { DEPENDENCIES } from './constants';

// import graphicHome from './graphicHome.png';
//
// const GraphicHome = styled(NormalImg)`
//   width: 100%;
//   margin-bottom: -2em;
// `;

const SectionTop = styled(Section)`
  text-align: center;
  min-height: 100vH;
  margin-top: -150px;
  padding-top: 130px;
`;
const ButtonIconOnly = styled(Button)`
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
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
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
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
  background-color: ${palette('primary', 1)};
`;
const SectionMore = styled(Section)`
  color: ${palette('dark', 3)};
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
  color:${palette('headerBrand', 0)};
  font-family: ${(props) => props.theme.fonts.headerBrandMain};
  text-transform: uppercase;
  margin-bottom:0;
  font-size: 2.8em;
`;

const Claim = styled.p`
  color: ${palette('headerBrand', 1)};
  font-family: ${(props) => props.theme.fonts.headerBrandClaim};
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
    pages.map((page) => ({
      path: `/pages/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
    })).toArray();

  render() {
    const { dataReady, onPageLink, pages, taxonomies } = this.props;
    // <GraphicHome src={graphicHome} alt={this.context.intl.formatMessage(messages.pageTitle)} />
    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop dark>
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
              <ButtonHero onClick={() => scrollToComponent(this.SectionCategories)}>
                <FormattedMessage {...messages.explore} />
              </ButtonHero>
            </div>
            <ButtonIconWrap>
              <ButtonIconOnly onClick={() => scrollToComponent(this.SectionCategories)}>
                <Icon name="arrowDown" size={'2.5em'} />
              </ButtonIconOnly>
            </ButtonIconWrap>
          </TopActions>
        </SectionTop>
        <SectionCategories innerRef={(node) => { this.SectionCategories = node; }}>
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
                  <Icon name="s" size={'4em'} />
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
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectEntities(state, 'taxonomies'),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DB_TABLES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
      // kick off loading although not needed
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
