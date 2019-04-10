const path = require("path");
const {REQ, RES} = require(path.join(__dirname, "../../util/logger"));

module.exports = enmap => ( req, res ) => {

    //split id of any file extensions
    const id = req.params.id.split(".")[0];
    if (req.subdomains.length || req.path.match(/(\/i\/[a-z,A-Z]*)(\.[a-z,A-Z]*)?/)) {
        let obj = enmap.get(id);
        if (!obj) {

            //When there is a . in the requested ID we assume the client attempted to retrieve an image
            if (req.params.id.includes(".")) {
                RES({code: 404, msg:"Image not found"});
                return replacement_image( req, res );
            } else {
                RES({code: 404, msg:"ID not found"});
                return res.status(404).render("index", {message: "ID not found"});
            }
        }

        if (obj.type === "text")
            res.render("text",{text: obj.text});

        if (obj.type === "url")
            res.redirect(obj.url.includes("://") ? obj.url : `http://${obj.url}`);
        
        if (obj.type === "image")
            return res.sendFile(obj.path)

    }
    else res.render('index', {message: "Page not found"});

};