const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy({"src/favicon/": "/"});
    eleventyConfig.addPlugin(eleventyImageTransformPlugin);
    return {
        dir: {
            input: "src",
            output: "docs",
        },
    };
};