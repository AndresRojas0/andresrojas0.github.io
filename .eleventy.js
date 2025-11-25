module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy({"src/favicon/": "/"});
    return {
        dir: {
            input: "src",
            output: "docs",
        },
    };
};