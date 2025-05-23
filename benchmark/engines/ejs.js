import ejs from 'ejs';
import fs from 'node:fs';

export default {
  name: 'ejs',
  ext: 'ejs',
  render: function (templatePath, data) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    return ejs.render(template, data);
  },
};
