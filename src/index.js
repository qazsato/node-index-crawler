// モジュール読み込み
var config = require('config');        // 定義
var client = require('cheerio-httpcli');  // 通信
var fs = require('fs');            // ファイル
var async = require('async');        // 同期処理
var cronJob = require('cron').CronJob;    // cron
var cronTime = "0 0 0 * * 0-6";        // cron実行時刻。毎日0:00:00に実行

var job = new cronJob({
  //実行したい日時 or crontab書式
  cronTime: cronTime,
  //指定時に実行したい関数
  onTick: function() {
    // インデックス集計処理
    async.eachSeries(config.data, function(data, next) {
      var query = "site:" + data.url;
      client.fetch(config.url, { q: query }, function (err, $, res) {
        var index = getIndexNumber($("#resultStats").text());
        var text = data.title + " : " + index + "\n";
        console.log(data.title + " : " + index);
        fs.appendFile('result.csv', text ,'utf8', function (err) {});
        next();
      });
    }, function(err) {
        console.log('all done!');
    });
  },
  //ジョブの完了または停止時に実行する関数
  onComplete: function() {
    console.log('onComplete!');
  },
  // コンストラクタを終する前にジョブを開始するかどうか
  start: false,
  //タイムゾーン
  timeZone: "Asia/Tokyo"
});
job.start();  //ジョブ開始


function getIndexNumber(result) {
  var number;
  if (result.indexOf("約") !== -1) {
    number = result.split("約 ")[1].split(" 件")[0].replace(",", "");
  } else {
    number = result.split(" 件")[0];
  }
  return number;
}
