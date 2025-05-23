import { expect, it } from 'vitest'
import { parse } from '../../test/__helper'

it('basic', async () => {
  expect(
    await parse(
      '{{ #raw }}<script type="text/template">{{ #if x }}foo{{ /if }}</script>{{ /raw }}',
    ),
  ).toMatchInlineSnapshot(
    `""use strict";return(async()=>{let s="";s+="<script type=\\"text/template\\">{{ #if x }}foo{{ /if }}</script>";return s;})();"`,
  )
})
