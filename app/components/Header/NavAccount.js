import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { PATHS, PARAMS } from 'containers/App/constants';

import LinkAccount from './LinkAccount';
import LinkAccountLoading from './LinkAccountLoading';
import messages from './messages';


const Styled = styled.div`
  float:right;
  background-color: ${palette('headerNavAccount', 0)};
`;


class NavAccount extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  onClick = (evt, path, currentPath) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (currentPath) {
      if (currentPath === PATHS.LOGIN || currentPath === PATHS.REGISTER) {
        this.props.onPageLink(path, { keepQuery: true });
      } else {
        this.props.onPageLink(path, {
          query: {
            arg: PARAMS.REDIRECT_ON_AUTH_SUCCESS,
            value: currentPath,
          },
        });
      }
    } else {
      this.props.onPageLink(path);
    }
  }
  render() {
    const { isSignedIn, currentPath, user } = this.props;

    const userPath = user ? `${PATHS.USERS}/${user.id}` : '';

    return (
      <Styled>
        {isSignedIn && user &&
          <LinkAccount
            href={userPath}
            active={currentPath === userPath}
            onClick={(evt) => this.onClick(evt, userPath)}
          >
            {user.name}
          </LinkAccount>
        }
        {isSignedIn && !user &&
          <LinkAccountLoading>
            <FormattedMessage {...messages.userLoading} />
          </LinkAccountLoading>
        }
        {isSignedIn &&
          <LinkAccount
            href={PATHS.LOGOUT}
            active={currentPath === PATHS.LOGOUT}
            onClick={(evt) => this.onClick(evt, PATHS.LOGOUT)}
          >
            <FormattedMessage {...messages.logout} />
          </LinkAccount>
        }
        {!isSignedIn &&
          <LinkAccount
            href={PATHS.REGISTER}
            active={currentPath === PATHS.REGISTER}
            onClick={(evt) => this.onClick(evt, PATHS.REGISTER, currentPath)}
          >
            <FormattedMessage {...messages.register} />
          </LinkAccount>
        }
        {!isSignedIn &&
          <LinkAccount
            href={PATHS.LOGIN}
            active={currentPath === PATHS.LOGIN}
            onClick={(evt) => this.onClick(evt, PATHS.LOGIN, currentPath)}
          >
            <FormattedMessage {...messages.login} />
          </LinkAccount>
        }
      </Styled>
    );
  }
}
NavAccount.propTypes = {
  isSignedIn: PropTypes.bool,
  user: PropTypes.object,
  currentPath: PropTypes.string,
  onPageLink: PropTypes.func.isRequired,
};

export default NavAccount;
