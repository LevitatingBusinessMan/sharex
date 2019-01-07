const path = require('path');
const config = require("../config/config");
const newID = require("../idCreator")

module.exports = (req,res) => {

    if (!req.body)
        return res.status(400).send("Missing key!");
    if (!req.body.key)
        return res.status(400).send("Missing key!");
    if (!config.keys.includes(req.body.key))
        return res.status(400).send("Invalid key!");

    if (!req.files)
        return res.status(400).send("No image!");

    if (!req.files.image)
        return res.status(400).send("No image!");
    
    let file = req.files.image;
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/gif")
        return res.status(400).send("Invalid image type!");
    let filename = `${newID()}.${file.mimetype.substr("image/".length)}`;
    file.mv(path.join(__dirname, '../images', filename));
    res.send(`${config.protocol}://image.${config.domain}/${filename}`)
}