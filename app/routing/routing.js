module.exports = function(app) {
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../usageGuide/index.html'));
    });
}