module.exports = function(app, db) {
  var validUrl = require('valid-url');
  var urlCollection = db.collection('urls');

  app.get('/:miniurl', function(req, res) {
    redirect(req.params.miniurl, res)
  })

  function redirect(miniUrl, res) {
      urlCollection.findOne({
        miniurl: Number(miniUrl)
      }, function(err, doc) {
        if (err || doc === null) {
          res.json('Cannot find url');
        } else {
          res.redirect(doc.originalurl);
        }
      });
  };

  app.get('/new/:url*', function(req, res) {
    res.json(generateNewUrl(req.url.slice(5), req, res));
  })

  function generateNewUrl(url, req, res) {
      if (validUrl.isWebUri(url) === undefined) {
        res.json('Please use a valid URL.')
        return;
      }

      var newUrl = createUniqueNumber();
      var doc = {originalurl: url, miniurl: newUrl};
      urlCollection.insertOne({originalurl: url, miniurl: newUrl});
      return {originalurl: url,
        miniurl: req.protocol + '://' + req.get('host')+'/'+newUrl
      };   
  }

  function createUniqueNumber() {
    var newUrl = calculateRandomNumber();
    while (urlCollection.find({miniurl: newUrl}).count()>0 && urlCollection.count() < 900000) {
      newUrl = calculateRandomNumber();
    }
    return newUrl;
  }

  function calculateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}