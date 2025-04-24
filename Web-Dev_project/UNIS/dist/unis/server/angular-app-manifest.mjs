
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 933, hash: '4d467c3be77dab5c4b0af93bee20c3ad383bf73c62537d8a10d9639d900d9eea', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1124, hash: '9e87ebbbce453dd7e99f3d3fd30dac8aa651f3b521b8e5174fd67e512ad375d3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NCVICERB.css': {size: 389, hash: 'DAsK1YP9FDg', text: () => import('./assets-chunks/styles-NCVICERB_css.mjs').then(m => m.default)}
  },
};
