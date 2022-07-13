/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Cookies from "js-cookie";
const TokenKey = "x-access-token";
const inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: any) {
  return Cookies.set(TokenKey, token, { expires: inFifteenMinutes });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getParam(variable:any) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
}
