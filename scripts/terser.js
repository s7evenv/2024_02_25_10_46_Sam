
const fs = require('fs');
const path = require('path');
const { minify } = require("terser");

const code = {
    "deobf.js": fs.readFileSync(path.join(__dirname, '..', 'dist', 'deobf.js')).toString()
};

const options = {
    toplevel: true,
    compress: {
        drop_console: true,
        // global_defs: {
        //     "@console.log": "alert"
        // },
        passes: 2
    },
    mangle: {
        properties: false,// {keep_quoted: true},
        reserved:[],
    },
    output: {
        beautify: false,
        // preamble: "/* uglified */"
    }
};

(async () => {
    const result = await minify(code, options);
    if (!result.code) throw new Error('minify failed');
    fs.writeFileSync(path.join(__dirname, '..', 'dist', 'deobf.min.js'), result.code)
})();
