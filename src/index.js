// モジュール読み込み
var config      = require('config');                  // 定義
var cronJob     = require('cron').CronJob;            // cron
var client      = require('cheerio-httpcli');         // 通信
var fs          = require('fs');                      // ファイル
var async       = require('async');                   // 同期処理
var Spreadsheet = require('edit-google-spreadsheet'); // スプレッドシート

var start = function () {
  cronFunc(function () {
    fetchFunc(function (indexes) {
      spreadSheetFunc(indexes);
      csvFileFunc(indexes);
    });
  });
};

var cronFunc = function (callback) {
  if (config.global.cron.enable) {
    var job = new cronJob({
      cronTime: config.global.cron.time,  //実行したい日時 or crontab書式
      onTick: function() {  //指定時に実行したい関数
        callback();
      },
      onComplete: function() {  //ジョブの完了または停止時に実行する関数
      },
      start: false, // コンストラクタを終する前にジョブを開始するかどうか
      timeZone: "Asia/Tokyo"  //タイムゾーン
    });
    job.start();  //ジョブ開始
  } else {
    callback();
  }
};

var fetchFunc = function (callback) {
  var indexes = [];
  async.eachSeries(config.data, function(data, next) {
    var query = "site:" + data.url;
    client.fetch(config.global.url, { q: query }, function (err, $, res) {
      // HTML解析
      $("#resultStats").find("nobr").remove();
      var index = {
        title: data.title,
        number: $("#resultStats").text().replace(/,/g, "").match(/\d+/g)[0]
      };
      console.log(index.title + " : " + index.number);
      indexes.push(index);
      next();
    });
  }, function(err) {
      callback(indexes);
  });
};

var spreadSheetFunc = function (indexes) {
  if (!config.global.spreadsheet.enable) return;
};

var csvFileFunc = function (indexes) {
  if (!config.global.csv.enable) return;
  var text = "";
  for (var i = 0; i < indexes.length; i++) {
    text += indexes[i].title + "," + indexes[i].number + "\n";
  }
  fs.appendFile('result.csv',text ,'utf8', function (err) {});
};

start();  // 実行
