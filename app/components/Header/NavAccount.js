import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { ROUTES, PARAMS } from 'containers/App/constants';
import { ENABLE_AZURE } from 'themes/config';

import LinkAccount from './LinkAccount';
import LinkAccountLoading from './LinkAccountLoading';
import messages from './messages';


const Styled = styled.div`
  background-color: ${palette('headerNavAccount', 0)};
`;
class NavAccount extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  onClick = (evt, path, currentPath, fullPath) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (currentPath) {
      if (currentPath === ROUTES.LOGIN || currentPath === ROUTES.REGISTER) {
        this.props.onPageLink(evt, path, { keepQuery: true });
      } else {
        this.props.onPageLink(evt, path, {
          query: {
            arg: PARAMS.REDIRECT_ON_AUTH_SUCCESS,
            value: fullPath,
          },
        });
      }
    } else {
      this.props.onPageLink(evt, path);
    }
  };

  render() {
    const {
      isSignedIn, currentPath, fullPath, user,
    } = this.props;
    const userPath = user ? `${ROUTES.USERS}/${user.id}` : '';
    return (
      <Styled>
        {isSignedIn && user
          && (
            <LinkAccount
              href={userPath}
              active={currentPath === userPath}
              onClick={(evt) => this.onClick(evt, userPath)}
            >
              {user.name}
            </LinkAccount>
          )
        }
        {isSignedIn && !user
          && (
            <LinkAccountLoading>
              <FormattedMessage {...messages.userLoading} />
            </LinkAccountLoading>
          )
        }
        {isSignedIn
          && (
            <LinkAccount
              href={ROUTES.LOGOUT}
              active={currentPath === ROUTES.LOGOUT}
              onClick={(evt) => this.onClick(evt, ROUTES.LOGOUT, currentPath, fullPath)}
            >
              <FormattedMessage {...messages.logout} />
            </LinkAccount>
          )
        }
        {!isSignedIn && !ENABLE_AZURE
          && (
            <LinkAccount
              href={ROUTES.REGISTER}
              active={currentPath === ROUTES.REGISTER}
              onClick={(evt) => this.onClick(evt, ROUTES.REGISTER, currentPath, fullPath)}
            >
              <FormattedMessage {...messages.register} />
            </LinkAccount>
          )
        }
        {!isSignedIn
          && (
            <LinkAccount
              href={ROUTES.LOGIN}
              active={currentPath === ROUTES.LOGIN}
              onClick={(evt) => this.onClick(evt, ROUTES.LOGIN, currentPath, fullPath)}
            >
              <FormattedMessage {...messages.login} />
            </LinkAccount>
          )
        }
      </Styled>
    );
  }
}
NavAccount.propTypes = {
  isSignedIn: PropTypes.bool,
  user: PropTypes.object,
  currentPath: PropTypes.string,
  fullPath: PropTypes.string,
  onPageLink: PropTypes.func.isRequired,
};

export default NavAccount;
