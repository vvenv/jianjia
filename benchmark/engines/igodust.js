import igodust from 'igo-dust';

export default {
  name: 'igodust',
  ext: 'dust',
  render: function (template, data) {
    return igodust.renderFile(template, data);
  },
};
