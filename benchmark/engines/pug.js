import pug from 'pug';

export default {
  name: 'pug',
  ext: 'pug',
  render: function (templatePath, data) {
    return pug.compileFile(templatePath)(data);
  },
};
