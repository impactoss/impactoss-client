/**
 * LinkInvalid
 */

import React from 'react';
import PropTypes from 'prop-types';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import styled from 'styled-components';

import ContentHeader from 'components/ContentHeader';
import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Icon from 'components/Icon';
import Footer from 'containers/Footer';
import A from 'components/styled/A';
import { ROUTES } from 'containers/App/constants';

import { updatePath } from 'containers/App/actions';

import messages from './messages';

const ViewContainer = styled(Container)`
  min-height: 100vH;
`;

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class LinkInvalid extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.props;
    return (
      <div>
        <HelmetCanonical
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <ContainerWrapper>
          <ViewContainer>
            <ContentHeader
              title={intl.formatMessage(messages.pageTitle)}
            />
            <p>
              <FormattedMessage {...messages.info} />
            </p>
            <BottomLinks>
              <p>
                <FormattedMessage {...messages.loginLinkBefore} />
                <A
                  href={ROUTES.LOGIN}
                  onClick={(evt) => {
                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                    this.props.handleLink(ROUTES.LOGIN);
                  }}
                >
                  <FormattedMessage {...messages.loginLink} />
                  <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                </A>
              </p>
              <p>
                <FormattedMessage {...messages.recoverLinkBefore} />
                <A
                  href={ROUTES.RECOVER_PASSWORD}
                  onClick={(evt) => {
                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                    this.props.handleLink(ROUTES.RECOVER_PASSWORD);
                  }}
                >
                  <FormattedMessage {...messages.recoverPasswordLink} />
                  <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                </A>
              </p>
            </BottomLinks>
          </ViewContainer>
          <Footer />
        </ContainerWrapper>
      </div>
    );
  }
}

LinkInvalid.propTypes = {
  intl: PropTypes.object.isRequired,
  handleLink: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(LinkInvalid));
