import { Eta } from 'eta';
import path from 'node:path';

export default {
  name: 'eta',
  ext: 'eta',
  render: function (template, data) {
    return new Eta({ views: path.join(import.meta.dirname, '..') }).render(
      template,
      data,
    );
  },
};
