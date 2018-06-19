const express = require("express");
const request = require("request");
const router = express.Router();

const response = require("../response");
const { requestPageInfo } = require("../webClient");
const { url } = require("../hitomi-chan-utility");
const { isParamIdValid } = require("../utils");

router.get("/big/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if(!isParamIdValid(id)) {
        res.send(response.getFailResponse("id must be an integer value!"));
        return;
    }

    requestPageInfo(id, (pages) => {
        if(pages === null || pages.length === 0) {
            res.status(404).send();
            return;
        }

        request(url.getBigThumbUrl(id, pages[0].name)).pipe(res);
    });
});

router.get("/small/:id/:fileName", (req, res) => {
    const id = parseInt(req.params.id);
    const fileName = req.params.fileName;

    if(!isParamIdValid(id)) {
        res.send(response.getFailResponse("id must be an integer value!"));
        return;
    }

    request(url.getSmallThumbUrl(id, fileName)).pipe(res);
});

module.exports = router;