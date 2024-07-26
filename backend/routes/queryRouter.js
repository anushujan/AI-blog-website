const router = require("express").Router();

const { creatingQueryResponse, gettingQueryResponses, gettingSuggestionQueryResponse } = require("../controllers/queryController");

// Define routes for user operations

router.post("/create-query-response", creatingQueryResponse);

router.post("/find-matching-response", gettingQueryResponses);

router.post("/find-out-matching-queries", gettingSuggestionQueryResponse);

module.exports = router;
