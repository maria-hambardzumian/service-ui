import { getBasicClickEventParameters } from '../common/ga4Utils';

export const LOGIN = 'login';

const LOGIN_PAGE = 'login_page';

export const LOGIN_PAGE_EVENTS = {
  clickOnSocialIcon: (iconType) => {
    return {
      ...getBasicClickEventParameters(LOGIN_PAGE),
      element_name: iconType,
      place: 'footer',
    };
  },
  CLICK_ON_RPP_LOGO: {
    ...getBasicClickEventParameters(LOGIN_PAGE),
    element_name: 'logo',
    place: 'header',
  },
  clickOnLoginButton: (authType) => ({
    ...getBasicClickEventParameters(LOGIN_PAGE),
    element_name: authType === LOGIN ? LOGIN : `login_with_${authType}`,
  }),
};
