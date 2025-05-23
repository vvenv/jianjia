import handlebars from 'handlebars';
import fs from 'node:fs';

export default {
  name: 'handlebars',
  ext: 'handlebars',
  render: function (templatePath, data) {
    return handlebars.compile(fs.readFileSync(templatePath, 'utf8'))(data);
  },
};
