// This function is used to configure the Eleventy generator.

// If you want to experiment with other configuration settings,
// you can read about them here: https://www.11ty.dev/docs/config/
export default function (eleventyConfig) {
	// This sets the input directory for our site
	eleventyConfig.setInputDirectory("source");

	// This will copy over any jpg, css, or javascript files from
	// the input directory to the output directory
	eleventyConfig.addPassthroughCopy("source/**/*.jpg");
	eleventyConfig.addPassthroughCopy("source/**/*.css");
	eleventyConfig.addPassthroughCopy("source/**/*.js");

	// By default, all pages will use the "base.html" template in
	// source/_includes/base.html
	// You can either change this directly for all pages, or override
	// this for specific pages using the "layout" tag
	eleventyConfig.addGlobalData("layout", "base.html");
};