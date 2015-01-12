// モジュール読み込み
var config = require('config');				// 定義
var client = require('cheerio-httpcli');	// 通信
var fs = require('fs');						// ファイル

// 通信する関数
var fetch = function (data) {
	var query = "site:" + data.url;
	client.fetch(config.url, { q: query }, function (err, $, res) {
		var index = $("#resultStats").text().split("約 ")[1].split(" 件")[0];
		var text = data.title + " : " + index + "\n";
		console.log(data.title + " : " + index);
		fs.appendFile('result.txt', text ,'utf8', function (err) {});
	});
};

// 実行処理
for (var i = 0; i < config.data.length; i++) {
	fetch(config.data[i]);
}