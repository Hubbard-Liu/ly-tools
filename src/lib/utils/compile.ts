/*
 * @Author: Do not edit
 * @Date: 2023-05-09 22:21:07
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-09 23:30:42
 * @FilePath: /ly-tools/src/lib/utils/compile.ts
 */
import * as ejs from 'ejs';
import * as templates from '../templates';

interface Data {
  name: string;
  upperName: string;
  path: string;
}

/**
 * 
 * @param templateName 模板名称
 * @param data 
 * @returns 
 */
const compile: (templateName: keyof typeof templates ,data: Data) => string = (templateName, data) => {

  const templatePosition = templates[templateName];

  return ejs.render(templatePosition, { data });
};

export {
  compile
};
