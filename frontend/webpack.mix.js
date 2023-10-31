const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
    .copy('resources/assets', 'public/assets')
    .vue({ version: 2 })
    .version();

