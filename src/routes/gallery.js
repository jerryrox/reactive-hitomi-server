const express = require('express');
const router = express.Router();

const dbClient = require("../dbClient");
const webClient = require("../webClient");
const response = require("../response");
const { isParamIdValid } = require("../utils");

const minItemsPerPage = 1;
const defaultItemsPerPage = 30;
const maxItemsPerPage = 100;

/**
 * Returns the number of items to return on query result.
 * @returns {number}
 */
function getItemCount(count) {
    count = (count ? Number.parseInt(count) : defaultItemsPerPage);
    if(count < minItemsPerPage)
        return minItemsPerPage;
    else if(count > maxItemsPerPage)
        return maxItemsPerPage;
    return count;
}

router.get('/', (req, res) => {
    let page = (req.query.page || 1) - 1;
    let count = getItemCount(req.query.count);

    var docQuery = dbClient.buildSearchQuery(req.query);
    dbClient.attachOptions(docQuery, {id: -1}, page, count);

    dbClient.executeQuery(docQuery, (data) => {
        if(data === null) {
            res.send(response.getQueryErrorResponse());
            return;
        }
        
        res.send(response.getSuccessResponse(data));
    });
});

router.get("/:id/pages", (req, res) => {
    const id = parseInt(req.params.id);

    if(!isParamIdValid(id)) {
        res.send(response.getInvalidGalleryIdResponse());
        return;
    }

    webClient.requestPageInfo(id, (pages) => {
        if(pages === null) {
            response.sendNotFoundResponse(res);
            return;
        }

        res.send(response.getSuccessResponse(pages));
    });
});

module.exports = router;