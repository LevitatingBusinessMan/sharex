const path = require("path");
const config = require(path.join(__dirname, "../../../config/config"));
const newID = require(path.join(__dirname, "../../util/idCreator"));
const {blue} = require("chalk");

module.exports = enmap => (req, res) => {

    if (!req.body.url)
        return {code: 400, data: {err: "No url supplied!"}}

    //https://regexr.com/3tfih
    if (!/(((http)|(https)):\/\/)?(\w+:)?([a-z0-9@]+\.)+[a-z0-9]+(:\d+)?((\/[\w()?=&#-%-\S]+)+)?/.test(req.body.url))
        return {code: 400, data: {err: "Invalid url!"}}

    let id = newID();
    del_key = newID();
    enmap.set(id,{
        type: "url",
        url: req.body.url,
        key: req.body.key,
        del_key
    });

    let domain = config.domain;
    let prefix = config.prefix.url;

    const key = req.body.key;
    if (config.key_specifics[key]) {
        domain = config.key_specifics[key].base;
        prefix = config.key_specifics[key].image;
    }

    const response = {
        url: `${config.ssl ? "https" : "http"}://${prefix.length ? `${prefix}.${domain}/${id}` : `${domain}/i/${id}`}`,
        delete: `${config.ssl ? "https" : "http"}://${domain}/delete/${id}/${del_key}`
    }

    console.log(`ACT: ${blue("[URL]")} ${req.body.url} ${blue("=>")} ${response.url}`);
    return {code: 200, data: response}
}