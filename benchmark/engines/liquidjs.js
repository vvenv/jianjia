import { Liquid } from 'liquidjs';

export default {
  name: 'liquidjs',
  ext: 'liquid',
  render: function (template, data) {
    return new Liquid().renderFileSync(template, data);
  },
};
