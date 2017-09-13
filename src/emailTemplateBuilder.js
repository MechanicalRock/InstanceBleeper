var fs = require('fs');
var dot = require('dot');

var getFileContents = (file) => {
    var filename = `${__dirname}/${file}`;
    return fs.readFileSync(filename, 'utf8');
}

var buildTemplateObject = (event) => ({
    region: event.region,
    launchTime: new Date(event.time).toLocaleString(),
    instanceId: event.detail['instance-id']
})

var getHTMLString = (html, templateData) => {
    var fn = dot.template(html);
    return fn(templateData);
}

module.exports = {
    getFileContents,
    buildTemplateObject,
    getHTMLString
}