export interface BizResponse<T = Record<string, unknown> | Array<unknown>> {
  code: string;
  message: string;
  data: T & { pageNum?: number; pageSize?: number; total?: number };
  success: boolean;
}

export interface Rule {
  required?: boolean;
  message?: string;
  trigger?: string;
  validator?: (rule: Rule, value: string) => boolean;
}

export interface MenuItem {
  name: string;
  desc: string;
  key: string;
  url: string;
  icon?: string;
}
export interface MenuInfo extends MenuItem {
  subMenu?: MenuItem[];
}

//菜单树
export interface MenuTreeData extends MenuItem {
  id: string;
  key: string;
  parentId: string;
  title: string;
  children?: MenuTreeData[];
}

// token验证方式： 1、图形验证码:captcha（account，password，Captcha-Code(header)） 2、账密:password（account，password） 3、短信验证码:sms_captcha (mobile,smsCaptcha) 4、切换租户:switch_tenant(token,tenantId) 5、ldap:ldap(account，password) 6、刷新token:refresh_token (token)
export enum GrantType {
  CAPTCHA = "captcha",
  PASSWORD = "password",
  SMS_CAPTCHA = "sms_captcha",
  SWITCH_TENANT = "switch_tenant",
  LDAP = "ldap",
  REFRESH_TOKEN = "refresh_token",
}
