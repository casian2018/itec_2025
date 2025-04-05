import Cookies from 'js-cookie';

export const useUserFromCookies = () => {
  const email = Cookies.get('email') || '';
  const uid = Cookies.get('uid') || '';
  const name = Cookies.get('name') || '';
  return { email, uid, name };
};
