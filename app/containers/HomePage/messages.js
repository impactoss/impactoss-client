/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.HomePage.pageTitle',
    defaultMessage: 'Sadata Home',
  },
  metaDescription: {
    id: 'app.container.HomePage.metaDescription',
    defaultMessage: 'Home page description',
  },
  intro: {
    id: 'app.containers.HomePage.intro',
    defaultMessage: 'Welcome to Sadata, this is the introductory text that provides the user with some context and a brief overview about this site and its purpose. Two or three sentences will likely be sufficient to provide the user with some guidance.',
  },
  explore: {
    id: 'app.containers.HomePage.explore',
    defaultMessage: 'Explore',
  },
  exploreCategories: {
    id: 'app.containers.HomePage.exploreCategories',
    defaultMessage: 'Explore by category',
  },
  exploreCategoriesLead: {
    id: 'app.containers.HomePage.exploreCategoriesLead',
    defaultMessage: 'Explore UN recommendations and government actions by category',
  },
  exploreActions: {
    id: 'app.containers.HomePage.exploreActions',
    defaultMessage: 'Explore the Action Implementation Plan',
  },
  exploreActionsLead: {
    id: 'app.containers.HomePage.exploreActionsLead',
    defaultMessage: 'Complete list of all government actions addressing the UN recommendations',
  },
  exploreActionsLink: {
    id: 'app.containers.HomePage.exploreActionsLink',
    defaultMessage: 'Explore all actions',
  },
  exploreMore: {
    id: 'app.containers.HomePage.exploreMore',
    defaultMessage: 'Explore more',
  },
  exploreMoreLead: {
    id: 'app.containers.HomePage.exploreMoreLead',
    defaultMessage: 'Complete lists of UN recommendations and progress indicators that track the outcome of government actions',
  },
});
