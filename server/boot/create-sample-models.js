// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var async = require('async');

module.exports = function(app) {
  // data sources
  var mongoDs = app.dataSources.mongoDs;
  var mysqlDs = app.dataSources.mysqlDs;

  // create all models
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops),
    // gene_info: async.apply(createGeneInfo),
    // pathway: async.apply(createPathway),
    // snp_info: async.apply(createSNPInfo)
  }, function(err, results) {
    if (err) throw err;

    createReviews(results.reviewers, results.coffeeShops, function(err) {
      if (err) throw err;
      console.log('> models created successfully');
    });
  });

  // create reviewers
  function createReviewers(cb) {
    mongoDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);

      app.models.Reviewer.create([
        {email: 'foo@bar.com', password: 'foobar'},
        {email: 'john@doe.com', password: 'johndoe'},
        {email: 'jane@doe.com', password: 'janedoe'}
      ], cb);
    });
  }

  // create coffee shops
  function createCoffeeShops(cb) {
    mysqlDs.automigrate('CoffeeShop', function(err) {
      if (err) return cb(err);

      app.models.CoffeeShop.create([
        {name: 'Bel Cafe', city: 'Vancouver'},
        {name: 'Three Bees Coffee House', city: 'San Mateo'},
        {name: 'Caffe Artigiano', city: 'Vancouver'}
      ], cb);
    });
  }

  // create reviews
  function createReviews(reviewers, coffeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);

      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      app.models.Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: coffeeShops[2].id
        }
      ], cb);
    });
  }
  // create geneInfo
  function createGeneInfo(cb) {
    mysqlDs.automigrate('gene_info', function(err) {
      if (err) return cb(err);

      app.models.gene_info.create([
        {gene_name: 'test_gene_name', chromosomes_name: 'test_chromosomes_name', start_location: 'test_start_location', end_location: 'test_end_location'}
      ], cb);
    });
  }
  // create pathway
  function createPathway(cb) {
    mysqlDs.automigrate('pathway', function(err) {
      if (err) return cb(err);

      app.models.pathway.create([
        {pathway_name: 'test_gene_name', des: 'test_chromosomes_name', contain_genes: ['1', '2']}
      ], cb);
    });
  }
  // create snp_info
  function createSNPInfo(cb) {
    mysqlDs.automigrate('snp_info', function(err) {
      if (err) return cb(err);

      app.models.snp_info.create([
        {
          trait: 'Fat',
          marker: 'Chr01_15267',
          chr: 1,
          pos: 15267,
          df: 2,
          F: 0.330543274766459,
          p: 0.719681255813397,
          add_effect: 0.00516491097065063,
          add_f: 0.58477553000948,
          add_p: 0.447092257726097,
          dom_effect: -0.00590128913638032,
          dom_f: 0.483413612297874,
          dom_p: 0.489249366719721,
          errordf: 71,
          markerR2: 0.0094440935647556,
          genetic_var: 0.000518338853210959,
          residual_var: 0.0000539583788187144,
          LnLikelihood: -331.377780834755
        }
      ], cb);
    });
  }
};
