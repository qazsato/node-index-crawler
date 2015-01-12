// モジュール読み込み
var config = require('config');				// 定義
var client = require('cheerio-httpcli');	// 通信
var fs = require('fs');						// ファイル
var async = require('async');				// 同期処理

async.eachSeries(config.data, function(data, next) {
	var query = "site:" + data.url;
	client.fetch(config.url, { q: query }, function (err, $, res) {
		var index = $("#resultStats").text().split("約 ")[1].split(" 件")[0];
		var text = data.title + " : " + index + "\n";
		console.log(data.title + " : " + index);
		fs.appendFile('result.txt', text ,'utf8', function (err) {});
		next();
	});
}, function(err) {
    console.log('all done!');
});