import { Engine } from 'template';
import fs from 'node:fs';

export default {
  name: 'JianJia',
  ext: 'jianjia',
  render: async function (templatePath, data) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    return (await new Engine().compile(template)).render(data);
  },
};
