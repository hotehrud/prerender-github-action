const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

const routes = require('./seo.json');

module.exports = (config, env) => {
    if (env === 'production') {
        config.plugins = config.plugins.concat([
            new PrerenderSPAPlugin({
                routes: [].concat(routes.map(item => item.route)),
                staticDir: path.join(__dirname, 'build'),
                postProcess(renderedRoute) {
                    let { html, route } = renderedRoute;
                    const { title, description, imageUrl, url } = routes.find(
                        item => item.route === route
                    );
                    const metaData =
                        `<title>${title}</title>` +
                        `<meta name="title" content="${title}" />` +
                        `<meta name="description" content="${description}" />` +
                        `<meta property="og:url" content="${url}" />` +
                        `<meta property="og:type" content="website" />` +
                        `<meta property="og:title" content="${title}" />` +
                        `<meta property="og:description" content="${description}" />` +
                        `<meta property="og:image" content="${imageUrl}" />` +
                        `<meta property="twitter:card" content="${imageUrl}" />` +
                        `<meta property="twitter:url" content="${url}" />` +
                        `<meta property="twitter:title" content="${title}" />` +
                        `<meta property="twitter:description" content="${description}" />` +
                        `<meta property="twitter:image" content="${imageUrl}" />`;

                    const start = html.indexOf('<head>') + '<head>'.length;
                    html = html.slice(0, start) + metaData + html.slice(start);
                    renderedRoute.html = html;
                    return renderedRoute;
                },
                renderer: new PrerenderSPAPlugin.PuppeteerRenderer()
            })
        ]);
    }

    return config;
};
