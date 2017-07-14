var Box = require("truffle-box");
var MemoryLogger = require("../memorylogger");
var CommandRunner = require("../commandrunner");
var fs = require("fs-extra");
var path = require("path");
var assert = require("assert");
var Reporter = require("../reporter");

describe("Solidity Tests with balances", function() {
  var logger = new MemoryLogger();
  var config;

  before("set up sandbox", function(done) {
    this.timeout(5000);
    Box.sandbox("bare", function(err, conf) {
      if (err) return done(err);
      config = conf;
      config.logger = logger;
      config.network = "development";
      config.mocha = {
        reporter: new Reporter(logger)
      }
      done();
    });
  });

  before("copy over test contract", function(done) {
    var from = path.join(__dirname, "TestWithBalance.sol");
    var to = config.test_directory;
    fs.copySync(from, to);
  });

  // For this scenario, see the TestWithBalance.sol file for the actual test case.
  // It'll test that its balance equals what it expect. We'll check the log to
  // ensure everything worked out fine.
  it("will run the test and have the correct balance", function(done) {
    this.timeout(20000);

    CommandRunner.run("test", config, function(err) {
      if (err) return done(err);

      assert(logger.contents().indexOf("1 passing") >= 0);

      done();
    });
  });

});
